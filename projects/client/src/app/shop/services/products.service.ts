import {Injectable} from '@angular/core';
import {ReplaySubject, Subscription} from 'rxjs';
import {InventoryItem, Product} from '../../shared/shop-types';
import {AngularFirestore} from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  products!: Product[];
  selectedProduct!: Product;
  selectedProductInventory!: InventoryItem[];

  selectedProductId!: string;

  productsSubject: ReplaySubject<Product[]> = new ReplaySubject(1);
  selectedProductSubject: ReplaySubject<Product> = new ReplaySubject(1);
  selectedProductInventorySubject: ReplaySubject<InventoryItem[]> = new ReplaySubject(1);

  selectedProductSubscription!: Subscription;
  selectedProductInventorySubscription!: Subscription;

  constructor(private angularFirestore: AngularFirestore) {
    this.initProductService();
  }



  initProductService() {
    this.angularFirestore.collection('products').valueChanges()
      .subscribe(products => {
        this.products = products as Product[];
        this.sortProductsArray();
        this.productsSubject.next(this.products);
      });
    this.selectedProductId = localStorage.getItem('selectedProduct') as string;
    if (this.selectedProductId) {
      this.selectProduct(this.selectedProductId);
    }
  }

  getProductsSubject(): ReplaySubject<Product[]> {
    return this.productsSubject;
  }

  getSelectedProductSubject(): ReplaySubject<Product> {
    return this.selectedProductSubject;
  }

  getSelectedProductInventorySubject(): ReplaySubject<InventoryItem[]> {
    return this.selectedProductInventorySubject;
  }

  selectProduct(productId: string) {
    if (this.selectedProductSubscription) {
      this.selectedProductSubscription.unsubscribe();
      this.selectedProductSubject = new ReplaySubject(1);
    }

    this.selectedProductSubscription = this.angularFirestore.collection('products').doc(productId)
      .valueChanges()
      .subscribe(product => {
        this.selectedProduct = product as Product;
        this.selectedProductSubject.next(this.selectedProduct);

        if (this.selectedProductId !== this.selectedProduct.productId) {
          this.selectedProductId = this.selectedProduct.productId;
          localStorage.setItem('selectedProduct', this.selectedProductId);
        }
      });
    this.loadSelectedProductInventory(productId);
  }


  loadSelectedProductInventory(productId: string) {
    if (this.selectedProductInventorySubscription) {
      this.selectedProductInventorySubscription.unsubscribe();
      this.selectedProductInventorySubject = new ReplaySubject(1);
    }

    this.selectedProductInventorySubscription = this.angularFirestore.collection('inventory', ref => ref
      .where('productId', '==', productId))
      .valueChanges()
      .subscribe(inventory => {
        this.selectedProductInventory = inventory as InventoryItem[];
        this.selectedProductInventorySubject.next(this.selectedProductInventory);
      });
  }


  sortProductsArray() {
    this.products.sort((a, b) => {
      if (a.productName < b.productName) {
        return -1;
      }
      if (a.productName > b.productName) {
        return 1;
      }
      return 0;
    });
  }



}
