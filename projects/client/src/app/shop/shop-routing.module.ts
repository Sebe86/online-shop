import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ShopComponent} from './shop.component';
import {ProductListComponent} from './product-list/product-list.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {CartComponent} from './cart/cart.component';
import {AuthenticationGuardService} from '../authentication/services/authentication-guard.service';
import {OrderCompleteComponent} from './order-complete/order-complete.component';

const routes: Routes = [
  {path: 'shop', component: ShopComponent, children: [
      {path: '', component: ProductListComponent},
      {path: 'cart', component: CartComponent},
      {path: 'checkout', loadChildren: './checkout/checkout.module#CheckoutModule', canActivate: [AuthenticationGuardService]},
      {path: 'order-complete', component: OrderCompleteComponent},
      {path: 'product', component: ProductDetailComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
