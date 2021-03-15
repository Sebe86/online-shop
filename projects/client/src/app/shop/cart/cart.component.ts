import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CartService} from '../services/cart.service';
import {Subscription} from 'rxjs';
import {Cart, CartItem} from '../../shared/shop-types';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  @Input() onlyCartView = false;

  subscription!: Subscription;
  cart!: Cart;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.subscription = this.cartService.getCartSubject()
      .subscribe((cart) => {
        this.cart = cart;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRemoveCartItem(cartItem: CartItem) {
    this.cartService.removeProductFromCart(cartItem);
  }

  onIncreaseAmount(cartItem: CartItem) {
    this.cartService.increaseProductAmount(cartItem);
  }

  onDecreaseAmount(cartItem: CartItem) {
    this.cartService.decreaseProductAmount(cartItem);
  }

}
