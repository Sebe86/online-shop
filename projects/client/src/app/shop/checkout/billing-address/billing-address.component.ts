import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer.service';
import {CheckoutService} from '../checkout.service';
import {Address, Customer} from '../../../shared/shop-types';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-billing-address',
  templateUrl: './billing-address.component.html',
  styleUrls: ['./billing-address.component.scss']
})
export class BillingAddressComponent implements OnInit, OnDestroy {
  @Input() editAddress = false;

  addressForm!: FormGroup;
  emailForm!: FormGroup;

  customer!: Customer;

  state: 'new' | 'edit' | 'show' | 'complete' | 'loading' = 'new';

  subscriptionArray: Subscription[] = [];


  constructor(private formBuilder: FormBuilder,
              private checkoutService: CheckoutService,
              private customerService: CustomerService) { }

  ngOnInit() {
    this.subscriptionArray.push(
      this.checkoutService.getCheckoutStateSubject()
        .subscribe(checkoutState => {
          this.customer = checkoutState.customer;

          this.state = checkoutState.state;
        })
    );
    this.initAddressForm();
  }


  ngOnDestroy(): void {
    this.subscriptionArray.forEach(subscription => subscription.unsubscribe());
  }


  onSubmit() {
    const data: Partial<Customer> = {};

    data.billingAddress = this.addressForm.value;

    if (this.customer.anonymousUser) {
      data.emailAddress = this.emailForm.value.email;
    }

    if (!this.customer.differentShippingAddress && this.customer.shippingAddress) {
      data.shippingAddress = this.addressForm.value;
    }

    this.customerService.updateCustomerData(data)
      .then(() => this.checkoutService.determineState())
      .catch(() => {});
  }


  onChangeDataField(field: 'billing' | 'shipping' | 'payment') {
    this.checkoutService.changeDataField(field);
  }


  onCancel() {
    this.checkoutService.determineState();
  }



  initAddressForm() {
    let addressData: Address = {
      name: '',
      lastName: '',
      street: '',
      streetNumber: null,
      zip: null,
      city: '',
    };

    if (this.customer.billingAddress) {
      addressData = this.customer.billingAddress;
    }

    this.addressForm = this.formBuilder.group({
      name: [addressData.name, [Validators.required, Validators.pattern(/\D+/)]],
      lastName: [addressData.lastName, [Validators.required, Validators.pattern(/\D+/)]],
      street: [addressData.street, [Validators.required, Validators.pattern(/\D+/)]],
      streetNumber: [addressData.streetNumber, [Validators.required, Validators.pattern(/\d+/)]],
      zip: [addressData.zip, [Validators.required, Validators.pattern(/\d+/)]],
      city: [addressData.city, [Validators.required, Validators.pattern(/\D+/)]]
    });

    if (this.customer.anonymousUser) {
      const emailAddress = this.customer.emailAddress ? this.customer.emailAddress : '';

      this.emailForm = this.formBuilder.group({
        email: [emailAddress, [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)]]
      });
    }
  }




}
