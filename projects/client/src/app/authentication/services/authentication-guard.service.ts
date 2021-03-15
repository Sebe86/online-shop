import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {tap} from 'rxjs/operators';
import {CartService} from '../../shop/services/cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuardService implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
              private cartService: CartService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authenticationService.getAuthenticationStateSnapshot().pipe(
      tap(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/authenticate'], { queryParams: { returnUrl: state.url }});
        } else if (authenticated && this.cartService.cart.cartItems.length > 0) {
          Promise.resolve(true);
        } else {
          this.router.navigate(['/shop']);
        }
      })
    );
  }

}
