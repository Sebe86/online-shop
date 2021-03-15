import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerDashboardComponent} from './customer-dashboard/customer-dashboard.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {AuthenticationComponent} from './authentication.component';

const routes: Routes = [
  {path: 'authenticate', component: AuthenticationComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'dashboard', component: CustomerDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
