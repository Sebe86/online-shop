import { Injectable } from '@angular/core';
import {Cart, Customer, OpenOrder, PaymentIntent} from '../../shared/shop-types';
import {AngularFireFunctions} from '@angular/fire/functions';
import {AngularFirestore} from '@angular/fire/firestore';
import {CustomerService} from './customer.service';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private customerService: CustomerService,
              private angularFunctions: AngularFireFunctions,
              private angularFirestore: AngularFirestore) {
  }




  createNewOrder(customer: Customer, cart: Cart, shippingMethod: 'priority' | 'economy', paymentIntent: PaymentIntent) {
    const createAndCompleteOnlineShopOrder = this.angularFunctions.httpsCallable('createAndCompleteOnlineShopOrder');

    const orderId = this.getOrGenerateOrderId();

    const data = {
      customer,
      cart,
      shippingMethod,
      paymentIntent,
      orderId
    };

    return createAndCompleteOnlineShopOrder(data);
  }


  getOrGenerateOrderId() {
    const customer = this.customerService.customer;
    
    if (customer?.openOrder) {
      const orderAge = Date.now() - customer.openOrder.createdAt;

      if (orderAge < 3500000) {
        return customer.openOrder.orderId;
      }
    }

    const customerId = this.customerService.customer?.customerId;
    const randomKey = this.angularFirestore.createId();
    const orderId = randomKey.concat(customerId as string);

    const openOrder: OpenOrder = {
      orderId,
      createdAt: Date.now(),
      orderState: 'processing'
    };

    this.customerService.updateCustomerData({openOrder});

    return orderId;
  }
}
