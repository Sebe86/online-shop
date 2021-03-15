import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {CustomerService} from '../../shop/services/customer.service';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Customer} from '../../shared/shop-types';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {
  reauthenticate = false;
  wrongPassword = false;
  isLoading = true;

  passwordForm!: FormGroup;

  customer!: Customer;
  subscription!: Subscription;

  constructor(private authenticationService: AuthenticationService,
              private customerService: CustomerService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.subscription = this.customerService.getCustomerSubject()
      .subscribe(customer => {
        this.customer = customer;
        this.isLoading = false;
      });

    this.initForm();
  }


  onLogout() {
    this.isLoading = true;
    this.authenticationService.logout();
  }

  onDeleteAccount() {
    if (!this.authenticationService.currentUser?.isAnonymous) {
      this.reauthenticate = true;
    } else {
      this.isLoading = true;
      this.authenticationService.deleteAccount();
    }
  }


  deleteAccount() {
    if (this.passwordForm.status === 'INVALID') {
      return;
    }
    this.isLoading = true;
    this.authenticationService.reauthenticateUser(this.passwordForm.value.password)
      .then(() => {
        this.authenticationService.deleteAccount();
      })
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          console.log('Falsches Passwort');
          this.isLoading = false;
          this.wrongPassword = true;
          this.passwordForm.reset();
        }
      });

  }


  initForm() {
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required]
    });
  }

}
