import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../authentication.component.scss', './reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  returnUrl = '';
  passwordResetCode = '';
  email = '';

  passwordForm!: FormGroup;
  hidePassword = true;

  subscription!: Subscription;
  isLoading = false;

  constructor(private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.subscription = this.authenticationService.getAuthenticationState().subscribe(
      authenticated => {
        if (authenticated) {
          this.router.navigateByUrl(this.returnUrl);
        }
      }
    );

    this.passwordResetCode = this.route.snapshot.queryParams.oobCode;

    this.returnUrl = this.getReturnUrlFromResetLink(this.route.snapshot.queryParams.continueUrl) as string;
    this.authenticationService.verifyPasswordResetCode(this.passwordResetCode)
      .then(email => this.email = email);

    this.initForm();
  }


  async onSaveNewPassword() {
    if (!this.passwordForm.valid) {
      return;
    }

    this.isLoading = true;
    await this.authenticationService.confirmPasswordResetCode(this.passwordResetCode, this.passwordForm.value.password)
      .catch(error => {
        this.isLoading = false;
        console.log(error);
      });

    await this.authenticationService.loginWithEmailAndPassword(this.email, this.passwordForm.value.password);
  }


  getReturnUrlFromResetLink(link: string) {
    const url = new URL(link);
    return url.searchParams.get('returnUrl');
  }


  initForm() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

}
