import { NgModule } from '@angular/core';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { CartComponent } from './cart/cart.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import {SharedModule} from '../shared/shared.module';
import { OrderCompleteComponent } from './order-complete/order-complete.component';

@NgModule({
  imports: [
    SharedModule,
    ShopRoutingModule
  ],
  exports: [
    CartComponent
  ],
  declarations: [
    ShopComponent,
    CartComponent,
    ProductListComponent,
    ProductDetailComponent,
    OrderCompleteComponent
  ]
})
export class ShopModule { }
