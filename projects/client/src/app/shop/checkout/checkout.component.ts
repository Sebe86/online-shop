import {Component, OnDestroy, OnInit} from '@angular/core';
import {CustomerService} from '../services/customer.service';
import {Subscription} from 'rxjs';
import {CheckoutService, CheckoutState} from './checkout.service';
import {OrderService} from '../services/order.service';
import {PaymentService} from '../services/payment.service';
import {concatMap} from 'rxjs/operators';
import {Customer} from '../../shared/shop-types';
import {CartService} from '../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutState: CheckoutState;
  customer: Customer;

  state: 'new' | 'edit' | 'show' | 'loading' = 'loading';
  stateCart: 'edit' | 'show' = 'show';

  shippingMethod: 'priority' | 'economy' = 'priority';

  subscriptionArray: Subscription[] = [];


  constructor(private customerService: CustomerService,
              private orderService: OrderService,
              private checkoutService: CheckoutService,
              private cartService: CartService,
              private paymentService: PaymentService) { }

  ngOnInit() {
    this.subscriptionArray.push(this.checkoutService.getCheckoutStateSubject()
      .subscribe(checkoutState => {
        this.checkoutState = checkoutState;
        this.customer = checkoutState.customer;
        this.state = checkoutState.state;
        this.stateCart = checkoutState.stateCart;
      })
    );
  }


  ngOnDestroy() {
    this.subscriptionArray.forEach(subscription => subscription.unsubscribe());
  }


  onEdit(type: 'customer' | 'cart') {
    if (type === 'customer') {
      this.checkoutService.editCustomerData();
    }
    if (type === 'cart') {
      this.checkoutService.setCartState('edit');
    }
  }

  onSetShippingMethod(method: 'priority' | 'economy') {
    this.shippingMethod = method;

    if (this.customer.openOrder) {
      this.customerService.updateCustomerData({openOrder: null});
    }
  }


  onChangeDataField(field: 'billing' | 'shipping' | 'payment') {
    this.checkoutService.changeDataField(field);
  }


  checkButtonState(type: string): string {
    if (this.state === 'new') {
      switch (type) {
        case 'billing': {
          if (this.checkoutState.selectedDataField === 'billing') {
            return 'selected';
          } else if (this.customer.billingAddress) {
            return 'complete';
          } else {
            return 'selected';
          }
        }
        case 'shipping': {
          if (this.checkoutState.selectedDataField === 'shipping') {
            return 'selected';
          } else if (this.customer.shippingAddress) {
            return 'complete';
          } else  {
            return 'unselected';
          }
        }
        case 'payment': {
          if (this.checkoutState.selectedDataField === 'payment') {
            return 'selected';
          } else {
            return 'unselected';
          }
        }
      }
    } else {
      switch (type) {
        case 'billing': {
          if (this.checkoutState.selectedDataField === 'billing') {
            return 'selected';
          } else {
            return 'unselected';
          }
        }
        case 'shipping': {
          if (this.checkoutState.selectedDataField === 'shipping') {
            return 'selected';
          } else {
            return 'unselected';
          }
        }
        case 'payment': {
          if (this.checkoutState.selectedDataField === 'payment') {
            return 'selected';
          } else {
            return 'unselected';
          }
        }
      }
    }
  }


  onSetCheckoutState(state: 'new' | 'edit' | 'show' | 'loading') {
    this.checkoutService.setCheckoutState(state);
  }


  onOrder() {
    this.onSetCheckoutState('loading');
    if (this.checkoutState.customer.source.card.three_d_secure === 'required') {
      let amountToCharge = this.checkoutState.cart.priceTotal;

      if (this.shippingMethod === 'priority') {
        amountToCharge += 900;
      } else {
        amountToCharge += 700;
      }

      this.paymentService.createPaymentIntentFor3DSecureAuthentication(this.checkoutState.customer, amountToCharge)
        .pipe(
          concatMap(paymentIntent => this.paymentService.handleCardAction(paymentIntent.client_secret)),
          // tslint:disable-next-line:max-line-length
          concatMap(paymentIntent => this.orderService.createNewOrder(this.checkoutState.customer, this.checkoutState.cart, this.shippingMethod, paymentIntent))
        )
        .subscribe(
        result => {
          this.onOrderComplete();
        },
        error => this.onOrderError()
      );
    } else {
      this.orderService.createNewOrder(this.checkoutState.customer, this.checkoutState.cart, this.shippingMethod, null)
        .subscribe(
          result => {
            this.onOrderComplete();
          },
          error => this.onOrderError()
      );
    }
  }


  onOrderComplete() {
    this.cartService.deleteCart();
    this.checkoutService.onOrderComplete();
  }


  onOrderError() {
    this.checkoutService.onOrderError();
  }

}
