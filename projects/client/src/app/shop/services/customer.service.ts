import {Injectable} from '@angular/core';
import {AuthenticationService} from '../../authentication/services/authentication.service';
import {ReplaySubject, Subscription} from 'rxjs';
import {Customer} from '../../shared/shop-types';
import {AngularFirestore} from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customer!: Customer | null;
  customerSubject: ReplaySubject<Customer> = new ReplaySubject(1);

  customerSubscription!: Subscription;

  customerServiceInitialised = false;


  constructor(private angularFirestore: AngularFirestore,
              private authenticationService: AuthenticationService) {
    this.initCustomerService();
  }


  initCustomerService() {
    this.authenticationService.getAuthenticationState()
      .subscribe(authenticationState => {
        if (authenticationState) {
          if (!this.customerServiceInitialised) {
            this.initCustomerSubject();
            this.customerServiceInitialised = true;
          }
        } else {
          this.customer = null;
          this.customerServiceInitialised = false;
          this.customerSubject = new ReplaySubject(1);

          if (this.customerSubscription) {
            this.customerSubscription.unsubscribe();
          }
        }
      });

  }

  initCustomerSubject() {
    this.customerSubscription = this.angularFirestore.collection('customers').doc(this.authenticationService.currentUser?.uid).valueChanges()
      .subscribe(customer => {
        if (customer) {
          this.customer = customer as Customer;
          this.customerSubject.next(customer as Customer);
        }
      });
  }


  getCustomerSubject(): ReplaySubject<Customer> {
    return this.customerSubject;
  }



  updateCustomerData(data: {[key: string]: any}): Promise<any> {
    return this.angularFirestore.collection('customers').doc(this.customer?.customerId).update(data);
  }

}
