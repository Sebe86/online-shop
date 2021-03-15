import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

import firebase from 'firebase/app';
import {FirestoreService} from '../../core/services/firestore.service';
import {BehaviorSubject} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser!: firebase.User | null;
  userLoggedIn = new BehaviorSubject(false);


  constructor(private angularFireAuth: AngularFireAuth,
              private firestore: FirestoreService,
              private router: Router) {
    this.initAuthenticationService();
  }


  initAuthenticationService() {
    this.angularFireAuth.authState.subscribe( authenticated => {
        if (authenticated) {
          this.currentUser = authenticated;
          this.userLoggedIn.next(true);
        } else {
          this.currentUser = null;
          this.userLoggedIn.next(false);
        }
      }
    );
  }


  getAuthenticationState() {
    return this.userLoggedIn;
  }


  getAuthenticationStateSnapshot() {
    return this.angularFireAuth.authState.pipe(
      map(authenticationState => !!authenticationState),
      take(1)
    );
  }


  reauthenticateUser(password: string) {
    const credential = firebase.auth.EmailAuthProvider.credential(<string> this.currentUser?.email, password);
    return this.currentUser!.reauthenticateWithCredential(credential);
    
  }


  signInAnonymously() {
    return this.angularFireAuth.signInAnonymously();
  }


  createUserWithEmailAndPassword(email: string, password: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }


  loginWithEmailAndPassword(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }


  confirmPasswordResetCode(code: string, newPassword: string) {
    return this.angularFireAuth.confirmPasswordReset(code, newPassword);
  }


  verifyPasswordResetCode(code: string) {
    return this.angularFireAuth.verifyPasswordResetCode(code);
  }


  logout() {
    if (this.currentUser?.isAnonymous) {
      this.deleteAccount();
    } else {
      this.angularFireAuth.signOut();
      this.router.navigate(['/']);
    }
  }


  deleteAccount() {
    this.currentUser?.delete()
    .then(() => this.router.navigate(['/']));
  }


}

