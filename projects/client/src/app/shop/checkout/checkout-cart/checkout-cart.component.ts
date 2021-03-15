import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {Subscription} from 'rxjs';
import {Cart} from '../../../shared/shop-types';
import {CheckoutService} from '../checkout.service';

@Component({
  selector: 'app-checkout-cart',
  templateUrl: './checkout-cart.component.html',
  styleUrls: ['./checkout-cart.component.scss']
})
export class CheckoutCartComponent implements OnInit, OnDestroy {
  cart!: Cart;

  subscriptionArray: Subscription[] = [];

  constructor(private cartService: CartService,
              private checkoutService: CheckoutService) { }

  ngOnInit() {
    this.subscriptionArray.push(
      this.checkoutService.getCheckoutStateSubject()
        .subscribe(checkoutState => {
          this.cart = checkoutState.cart;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptionArray.forEach(subscription => subscription.unsubscribe());
  }

  closeCartEdit() {
    this.checkoutService.setCartState('show');
  }

}
