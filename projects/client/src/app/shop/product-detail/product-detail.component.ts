import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {ProductsService} from '../services/products.service';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CartService} from '../services/cart.service';
import {Cart, CartItem, InventoryItem, Product} from '../../shared/shop-types';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product!: Product;
  inventory!: InventoryItem[];
  variantsArray: string[] = [];
  subVariantsArray: string[] = [];


  productDetailSubscription!: Subscription;
  inventorySubscription!: Subscription;

  selectVariantOpen = false;
  selectSubVariantOpen = false;

  selectedVariant = '';
  selectedSubVariant = '';

  selectedImage = 0;
  selectedInventoryItem!: InventoryItem;

  cart!: Cart;
  selectedCartItem!: CartItem;

  selectedNavItem: 'info' | 'guide' | 'table' = 'info';

  isLoading = true;

  constructor(private activatedRoute: ActivatedRoute,
              private productsService: ProductsService,
              private formBuilder: FormBuilder,
              private cartService: CartService) { }

  ngOnInit() {
    this.getProductDetails();
    this.getProductInventory();

    this.cartService.getCartSubject()
      .subscribe(cart => {
        this.cart = cart;
        this.updateSelectedItem();
      }
    );
  }

  ngOnDestroy(): void {
    this.productDetailSubscription.unsubscribe();
    this.inventorySubscription.unsubscribe();
  }

  getProductDetails() {
    if (this.productDetailSubscription) {
      this.productDetailSubscription.unsubscribe();
    }
    this.productDetailSubscription = this.productsService.getSelectedProductSubject()
      .subscribe(
        product => {
          this.product = product;
          this.isLoading = false;
        }
      );
  }

  getProductInventory() {
    if (this.inventorySubscription) {
      this.inventorySubscription.unsubscribe();
    }
    this.inventorySubscription = this.productsService.getSelectedProductInventorySubject()
      .subscribe(
        inventory => {
          this.inventory = inventory;
          this.generateVariantsArrays(inventory);
          this.updateSelectedItem();
        }
      );
  }


  onSelectVariant(variant: string) {
    this.selectedVariant = variant;
    this.onCloseDropdown();
  }


  onSelectSubVariant(subVariant: string) {
    this.selectedSubVariant = subVariant;
    this.onCloseDropdown();
  }


  onCloseDropdown() {
    this.updateSelectedItem();
    this.selectVariantOpen = false;
    this.selectSubVariantOpen = false;
  }


  updateSelectedItem() {
    if (this.selectedVariant && this.selectedSubVariant) {
      this.selectedCartItem = this.cart.cartItems
        .find(item => {
          return item.productId === this.product.productId &&
            item.variant === this.selectedVariant && item.subVariant === this.selectedSubVariant;
        })!;

      this.selectedInventoryItem = this.inventory
        .find(item => {
          return item.productId === this.product.productId &&
            item.variant === this.selectedVariant && item.subVariant === this.selectedSubVariant;
        })!;
    }
  }

  onIncreaseAmount() {
    if (this.selectedCartItem) {
      this.cartService.increaseProductAmount(this.selectedCartItem);
    }
  }


  onDecreaseAmount() {
    if (this.selectedCartItem) {
      this.cartService.decreaseProductAmount(this.selectedCartItem);
    }
  }


  onAddToCart() {
    if (this.selectedInventoryItem) {
      this.cartService.addProductToCart(this.selectedInventoryItem);
    }
  }

  onSelectNavItem(item: 'info' | 'guide' | 'table') {
    this.selectedNavItem = item;
  }


  // helper functions

  generateVariantsArrays(inventory: InventoryItem[]) {
    inventory.forEach((item) => {
      if (!this.variantsArray.includes(item.variant)) {
        this.variantsArray.push(item.variant);
      }

      if (!this.subVariantsArray.includes(item.subVariant)) {
        this.subVariantsArray.push(item.subVariant);
      }
    });

    this.variantsArray.sort();
    this.subVariantsArray.sort();
  }


}
