import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';

import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthenticationComponent } from './authentication.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CustomerDashboardComponent, ResetPasswordComponent, AuthenticationComponent]
})
export class AuthenticationModule { }
