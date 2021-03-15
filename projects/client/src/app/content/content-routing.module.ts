import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ContentComponent} from './content.component';
import {TermsAndConditionsComponent} from './terms-and-conditions/terms-and-conditions.component';
import {LegalNoticeComponent} from './legal-notice/legal-notice.component';
import {ShippingComponent} from './shipping/shipping.component';
import {ReturnsComponent} from './returns/returns.component';

const routes: Routes = [
  {path: '', component: ContentComponent},
  {path: 'agb', component: TermsAndConditionsComponent},
  {path: 'lieferung', component: ShippingComponent},
  {path: 'ruecksendung', component: ReturnsComponent},
  {path: 'impressum', component: LegalNoticeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
