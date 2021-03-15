import { Injectable } from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {FirestoreService} from '../../core/services/firestore.service';
import {Cart, CartItem, InventoryItem} from '../../shared/shop-types';


interface CartItemSubscription {
  [itemId: string]: Subscription;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItemSubscription: CartItemSubscription = {};
  cartSubject!: BehaviorSubject<Cart>;
  cart!: Cart;

  constructor(private firestoreService: FirestoreService) {
    this.initialiseCart();
  }


  initialiseCart() {
    this.createCart();
    this.cartSubject = new BehaviorSubject(this.cart);
    this.initialiseCartItems();
  }


  getCartSubject(): BehaviorSubject<Cart> {
    return this.cartSubject;
  }


  getCart(): Cart {
    return this.cart;
  }


  deleteCart() {
    this.cart.cartItems.forEach((cartItem) => {
      this.cartItemSubscription[cartItem.itemId].unsubscribe();
    });
    localStorage.removeItem('cart');
    this.createCart();
    this.cartSubject.next(this.cart);
  }


  addProductToCart(inventoryItem: InventoryItem) {
    if (inventoryItem.amount === 0) {
      return;
    }

    const cartItem = this.getCartItem(inventoryItem.itemId);

    if (cartItem) {
      this.increaseProductAmount(cartItem);
    } else {
      this.createCartItemSubscription(inventoryItem.itemId);
    }
  }

  removeProductFromCart(cartItem: CartItem) {
    this.cartItemSubscription[cartItem.itemId].unsubscribe();

    const cartItemIndex = this.getCartItemIndex(cartItem.itemId);

    this.cart.cartItems.splice(cartItemIndex, 1);
    this.updateCart();
  }

  increaseProductAmount(cartItem: CartItem) {
    if (cartItem.amountInCart < cartItem.amount) {
      cartItem.amountInCart++;
      this.updateCart();
    }

  }

  decreaseProductAmount(cartItem: CartItem) {
    if (cartItem.amountInCart === 1) {
      this.removeProductFromCart(cartItem);
    } else {
      cartItem.amountInCart--;
    }
    this.updateCart();

  }


  // Helper functions


  createCart() {
    if (localStorage.getItem('cart')) {
      this.cart = JSON.parse(localStorage.getItem('cart') as string);
    } else {
      this.cart = {amountTotal: 0, priceTotal: 0, cartItems: []};
    }
  }


  updateCart() {
    this.calculateTotals();
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
  }

  calculateTotals() {
    let totalCost = 0;
    let itemsInCart = 0;
    this.cart.cartItems.forEach((element) => {
      totalCost += element.price * element.amountInCart;
      itemsInCart += element.amountInCart;
    });
    this.cart.priceTotal = totalCost;
    this.cart.amountTotal = itemsInCart;
  }

  getCartItem(itemId: string) {
    return this.cart.cartItems.find(item => item.itemId === itemId);
  }

  getCartItemIndex(itemId: string) {
    return this.cart.cartItems.findIndex(item => item.itemId === itemId);
  }


  initialiseCartItems() {
    this.cart.cartItems.forEach((cartItem) => {
      this.createCartItemSubscription(cartItem.itemId);
    });
  }


  createCartItemSubscription(itemId: string) {
    this.cartItemSubscription[itemId] = this.firestoreService.getDocumentData(`/inventory/${itemId}`)
      .subscribe(data => {
        const inventoryItem = data as InventoryItem;
        const cartItem = this.getCartItem(inventoryItem.itemId);

        if (cartItem) {
          const index = this.getCartItemIndex(cartItem.itemId);
          let amountInCart = cartItem.amountInCart;

          if (amountInCart > inventoryItem.amount) {
            amountInCart = inventoryItem.amount;
          }

          const newCartItem = {
            amountInCart,
            ...inventoryItem
          };
          this.cart.cartItems.splice(index, 1, newCartItem);
        } else {
          this.cart.cartItems.push({...inventoryItem, amountInCart: 1});
        }
        this.updateCart();
      });
  }


}
