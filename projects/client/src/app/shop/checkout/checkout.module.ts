import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../../shared/shared.module';
import {CheckoutComponent} from './checkout.component';
import {PaymentComponent} from './payment/payment.component';
import {ShippingAddressComponent} from './shipping-address/shipping-address.component';
import {CheckoutRoutingModule} from './checkout-routing.module';
import {ShopModule} from '../shop.module';
import {BillingAddressComponent} from './billing-address/billing-address.component';
import {CheckoutCartComponent} from './checkout-cart/checkout-cart.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ShopModule,
    CheckoutRoutingModule
  ],
  declarations: [
    CheckoutComponent,
    BillingAddressComponent,
    ShippingAddressComponent,
    PaymentComponent,
    CheckoutCartComponent
  ]
})
export class CheckoutModule { }
