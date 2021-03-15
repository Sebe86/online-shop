import { Injectable } from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationFunctionService {

  constructor(private angularFunctions: AngularFireFunctions) {}


  resetCustomerPassword(data: any) {
    const sendPasswordReset = this.angularFunctions.httpsCallable('resetCustomerPassword');
    return sendPasswordReset(data);
  }


}
