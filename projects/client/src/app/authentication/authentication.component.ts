import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from './services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationFunctionService} from './services/authentication-function.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit, OnDestroy {
  returnUrl = '';
  subscription!: Subscription;
  isLoading = false;

  instruction = 'Bitte gib deine Zugangsdaten ein, um dich anzumelden oder einen Account zu erstellen.';
  emailMissing = 'Wir benötigen deine E-Mail Adresse, um dein Passwort zurückzusetzen.';
  emailTaken = 'Es existiert schon ein Account, der diese E-Mail Adresse verwendet.';
  emailInvalid = 'Diese E-Mail Adresse existiert nicht, bitte überprüfe deine Eingabe.';
  passwordInvalid = 'Dein Passwort ist falsch, bitte überprüfe deine Eingabe.';
  unknownError = 'Etwas ging schief, bitte versuche es noch einmal.';
  resetSuccessful = 'Ein Link, mit dem du dein Passwort zurücksetzen kannst, wurde an deine E-Mail Adresse gesendet.';

  message = '';

  error = false;
  passwordReset = false;
  hidePassword = true;

  form!: FormGroup;

  constructor(private authenticationService: AuthenticationService,
              private functionService: AuthenticationFunctionService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    this.subscription = this.authenticationService.getAuthenticationState().subscribe(
      authenticated => {
        if (authenticated) {
          this.router.navigateByUrl(this.returnUrl);
        }
      }
    );
    this.initForm();
    this.message = this.instruction;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  onLoginCustomer() {
    if (!this.form.valid) {
      return;
    }
    this.error = false;
    this.isLoading = true;
    this.message = this.instruction;

    const email = this.form.value.email;
    const password = this.form.value.password;

    this.authenticationService.loginWithEmailAndPassword(email, password).catch(error => {
      if (error.code === 'auth/user-not-found') {
        this.message = this.emailInvalid;
      } else if (error.code === 'auth/wrong-password') {
        this.message = this.passwordInvalid;
      } else {
        this.message = this.unknownError;
      }
      this.isLoading = false;
      this.error = true;
    });
  }

  onCreateNewCustomer() {
    if (!this.form.valid) {
      return;
    }
    const email = this.form.value.email;
    const password = this.form.value.password;

    this.authenticationService.createUserWithEmailAndPassword(email, password)
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          this.message = this.emailTaken;
        } else {
          this.message = this.unknownError;
        }
        this.isLoading = false;
        this.error = true;
      });
    this.isLoading = true;
  }

  onLoginAsGuest() {
    this.isLoading = true;
    this.authenticationService.signInAnonymously()
      .catch(error => {
        this.message = this.unknownError;
      });
    this.isLoading = false;
    this.error = true;
  }

  onResetPassword() {
    if (this.form.get('email')?.valid) {
      this.error = true;
      this.message = this.emailMissing;
      return;
    }

    this.error = false;
    this.message = this.instruction;
    this.isLoading = true;

    const data = {
      email: this.form.value.email,
      returnUrl: this.returnUrl
    };

    this.functionService.resetCustomerPassword(data)
      .subscribe(
        success => {
          this.passwordReset = true;
          this.message = this.resetSuccessful;
          this.isLoading = false;
        },
        error => {
          if (error.message === 'customer does not exist') {
            this.message = this.emailInvalid;
          } else {
            this.message = this.unknownError;
          }
          this.isLoading = false;
          this.error = true;
        });
  }

  initForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
}
