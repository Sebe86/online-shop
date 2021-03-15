import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {from, Observable, of, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Customer, PaymentIntent, Source, HandleCardAction} from '../../shared/shop-types';
import {AngularFireFunctions} from '@angular/fire/functions';
import {AngularFirestore} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  stripeElements: any;
  newSourceToAdd!: Source;

  constructor(private angularFirestore: AngularFirestore,
              private angularFunctions: AngularFireFunctions) {

  }


  initStripeCardElement() {

  }



  addSourceToCustomer(customer: Customer, cardNumberElement: any): Observable<any> {
    const addSourceToCustomer = this.angularFunctions.httpsCallable('addSourceToCustomer');
    const idempotencyKey = this.angularFirestore.createId();

    const data = {
      customer,
      newSource: null,
      idempotencyKey
    };

    if (this.newSourceToAdd) {
      //data.newSource = this.newSourceToAdd;
      return addSourceToCustomer(data);
    } else {
      return this.createNewSourceWithStripe(cardNumberElement).pipe(
        switchMap(response => {
          if (response.error) {
            return throwError(response.error);
          } else {
            data.newSource = response.source;
            this.newSourceToAdd = response.source;
            console.log(data);
            return addSourceToCustomer(data);
          }
        })
      );
    }
  }



  createPaymentIntentFor3DSecureAuthentication(customer: Customer, amountToCharge: number): Observable<PaymentIntent> {
    // tslint:disable-next-line:max-line-length
    const createPaymentIntentFor3DSecureAuthentication = this.angularFunctions.httpsCallable('createPaymentIntentFor3DSecureAuthentication');
    const idempotencyKey = this.angularFirestore.createId();

    const data = {
      customer,
      amountToCharge,
      idempotencyKey
    };

    return createPaymentIntentFor3DSecureAuthentication(data);
  }



  handleCardAction(clientSecret: string): Observable<PaymentIntent> {
    return from<any>(this.stripe.handleCardAction(clientSecret)).pipe(
      switchMap((data: HandleCardAction) => {
        console.log(data);
        if (data.error) {
          return throwError(data.error);
        } else {
          return of(data.paymentIntent);
        }
      })
    );
  }



  createNewSourceWithStripe(cardNumberElement: any): Observable<any> {
    return from<any>(this.stripe.createSource(cardNumberElement));
  }

}

