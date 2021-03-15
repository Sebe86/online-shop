import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { ShippingComponent } from './shipping/shipping.component';
import { ReturnsComponent } from './returns/returns.component';

@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule
  ],
  declarations: [ContentComponent, TermsAndConditionsComponent, LegalNoticeComponent, ShippingComponent, ReturnsComponent]
})
export class ContentModule { }
