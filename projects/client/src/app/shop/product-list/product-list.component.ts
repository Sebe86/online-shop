import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ProductsService} from '../services/products.service';
import {Product} from '../../shared/shop-types';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products!: Product[];

  productsSubscription!: Subscription;

  constructor(private productsService: ProductsService,
              private router: Router) { }

  ngOnInit() {
    this.productsSubscription = this.productsService.getProductsSubject()
      .subscribe(products => this.products = products.sort((a, b) => {
        if (a.productName < b.productName) {
          return -1;
        }

        if (a.productName > b.productName) {
          return 1;
        }

        return 0;
      }));
  }


  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }


  onSelectProduct(productId: string) {
    this.productsService.selectProduct(productId);
    this.router.navigate(['/shop/product']);
  }

}
