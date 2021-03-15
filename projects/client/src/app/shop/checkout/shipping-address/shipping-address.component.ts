import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer.service';
import {CheckoutService} from '../checkout.service';
import {Address, Customer} from '../../../shared/shop-types';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss']
})
export class ShippingAddressComponent implements OnInit, OnDestroy {
  addressForm!: FormGroup;

  differentShippingAddress = false;

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
          this.differentShippingAddress = checkoutState.customer.differentShippingAddress as boolean;

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

    if (this.differentShippingAddress) {
      data.differentShippingAddress = true;
      data.shippingAddress = this.addressForm.value;
    } else {
      data.differentShippingAddress = false;
      data.shippingAddress = this.customer.billingAddress;
      console.log(this.customer.billingAddress);
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

  checkIfChangedAndValid(): boolean {

    if (this.differentShippingAddress === this.customer.differentShippingAddress && this.customer.differentShippingAddress) {
      if (this.differentShippingAddress) {
        return this.addressForm.status === 'VALID' && this.addressForm.dirty;
      } else {
        return false;
      }
    } else {
      if (this.differentShippingAddress) {
        return this.addressForm.status === 'VALID' && this.addressForm.dirty;
      } else {
        return this.state !== 'edit';
      }
    }
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

    if (this.customer.shippingAddress) {
      addressData = this.customer.shippingAddress;
    }


    this.addressForm = this.formBuilder.group({
      name: [addressData.name, [Validators.required, Validators.pattern(/\D+/)]],
      lastName: [addressData.lastName, [Validators.required, Validators.pattern(/\D+/)]],
      street: [addressData.street, [Validators.required, Validators.pattern(/\D+/)]],
      streetNumber: [addressData.streetNumber, [Validators.required, Validators.pattern(/\d+/)]],
      zip: [addressData.zip, [Validators.required, Validators.pattern(/\d+/)]],
      city: [addressData.city, [Validators.required, Validators.pattern(/\D+/)]]
    });
  }





}
