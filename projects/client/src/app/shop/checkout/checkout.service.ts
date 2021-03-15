import { Injectable } from '@angular/core';
import {Cart, Customer, Order, PaymentIntent} from '../../shared/shop-types';
import {BehaviorSubject} from 'rxjs';
import {CustomerService} from '../services/customer.service';
import {CartService} from '../services/cart.service';
import {OrderService} from '../services/order.service';
import {Router} from '@angular/router';


export interface CheckoutState {
  state: 'new' | 'edit' | 'show' | 'loading';
  selectedDataField: 'billing' | 'shipping' | 'payment';
  stateCart: 'show' | 'edit';
  customer: Customer;
  cart: Cart;
  paymentIntent: PaymentIntent;
}


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  checkoutStateSubject: BehaviorSubject<CheckoutState>;

  checkoutState: CheckoutState = {
    state: 'loading',
    selectedDataField: 'billing',
    stateCart: 'show',
    customer: null,
    cart: null,
    paymentIntent: null
  };


  constructor(private customerService: CustomerService,
              private cartService: CartService,
              private router: Router) {
    this.initCheckoutService();
  }


  initCheckoutService() {
    this.checkoutStateSubject = new BehaviorSubject<CheckoutState>(this.checkoutState);

    this.customerService.getCustomerSubject()
      .subscribe(customer => {
        this.checkoutState.customer = customer;
        this.determineState();
      });

    this.cartService.getCartSubject()
      .subscribe(cart => {
        this.checkoutState.cart = cart;
        this.checkoutStateSubject.next(this.checkoutState);
      });
  }


  getCheckoutStateSubject() {
    return this.checkoutStateSubject;
  }


  determineState() {
    if (this.checkoutState.customer.openOrder) {
      const openOrder = this.checkoutState.customer.openOrder;

      if (openOrder.orderState === 'processing') {
        this.checkoutState.state = 'loading';
      } else if (openOrder.orderState === 'complete') {
        this.onOrderComplete();
      } else {
        this.checkoutState.state = 'show';
      }
    } else {
      if (this.checkoutState.customer.source) {
        this.checkoutState.state = 'show';

      } else if (this.checkoutState.customer.shippingAddress) {
        this.checkoutState.state = 'new';
        this.checkoutState.selectedDataField = 'payment';

      } else if (this.checkoutState.customer.billingAddress) {
        this.checkoutState.state = 'new';
        this.checkoutState.selectedDataField = 'shipping';

      } else {
        this.checkoutState.state = 'new';
        this.checkoutState.selectedDataField = 'billing';
      }
    }
    this.checkoutStateSubject.next(this.checkoutState);
  }


  changeDataField(field: 'billing' | 'shipping' | 'payment') {
    this.checkoutState.selectedDataField = field;
    this.checkoutStateSubject.next(this.checkoutState);
  }


  editCustomerData() {
    this.customerService.updateCustomerData({openOrder: null});
    this.checkoutState.state = 'edit';
    this.checkoutStateSubject.next(this.checkoutState);
  }


  setCheckoutState(state: 'new' | 'edit' | 'show' | 'loading') {
    this.checkoutState.state = state;
    this.checkoutStateSubject.next(this.checkoutState);
  }


  setCartState(state: 'edit' | 'show') {
    this.customerService.updateCustomerData({openOrder: null});
    this.checkoutState.stateCart = state;
    this.checkoutStateSubject.next(this.checkoutState);
  }


  onOrderError() {
    this.customerService.updateCustomerData({'openOrder.orderState': 'open'});
    this.checkoutState.state = 'show';
    this.checkoutStateSubject.next(this.checkoutState);
  }


  onOrderComplete() {
    this.customerService.updateCustomerData({openOrder: null});
    this.checkoutState.state = 'show';
    this.checkoutStateSubject.next(this.checkoutState);
    this.router.navigate(['/shop/order-complete']);
  }







}
