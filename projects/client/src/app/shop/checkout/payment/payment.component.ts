import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PaymentService} from '../../services/payment.service';
import {Subscription} from 'rxjs';
import {CheckoutService} from '../checkout.service';
import {Customer} from '../../../shared/shop-types';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('cardNumber') cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc') cardCvcElement!: ElementRef;

  cardElements: any[] = [];
  formError!: string;
  formComplete = false;
  inputCompleteArray = [false, false, false];

  isLoading = false;
  loadingText = 'Überprüfe Karte';

  customer!: Customer;
  subscriptionArray: Subscription[] = [];

  state: 'new' | 'edit' | 'show' | 'complete' | 'loading' = 'new';

  screenAspectRatio!: number;

  cardInputStyle = {
    base: {
      fontSize: '' + window.screen.width * 0.011 + 'px',
      fontFamily: 'Open Sans'
    }
  };


  constructor(private checkoutService: CheckoutService,
              private paymentService: PaymentService) { }



  ngOnInit() {
    this.subscriptionArray.push(
      this.checkoutService.getCheckoutStateSubject()
        .subscribe(checkoutState => {
          this.customer = checkoutState.customer;

          this.state = checkoutState.state;
        })
    );

    this.screenAspectRatio = window.screen.width / window.screen.height;
    if (this.screenAspectRatio > 1.2) {
      this.cardInputStyle.base.fontSize = '' + window.screen.width * 0.011 + 'px';
    } else {
      this.cardInputStyle.base.fontSize = '' + window.screen.width * 0.035 + 'px';
    }

    this.paymentService.initStripeCardElement();
    this.initCardInput();
  }


  ngAfterViewChecked(): void {
    if (this.cardNumberElement) {
      if (this.cardNumberElement.nativeElement.childElementCount === 0) {
        this.mountCardToElement();
      }
    }
  }


  ngOnDestroy() {
    this.cardElements.forEach( (element) => {
      if (element) {
        element.destroy();
      }
    });
    this.subscriptionArray.forEach(subscription => subscription.unsubscribe());
  }


  initCardInput() {
    this.cardElements.push(this.paymentService.stripeElements.create('cardNumber', {style: this.cardInputStyle}));
    this.cardElements.push(this.paymentService.stripeElements.create('cardExpiry', {style: this.cardInputStyle}));
    this.cardElements.push(this.paymentService.stripeElements.create('cardCvc', {style: this.cardInputStyle}));

    // Listens to change event on the card for validation errors
    // this.cardElements.forEach((element, index) => {
    //   element.on('change', (event) => {
    //     if (event.error) {
    //       this.formError = event.error.message;
    //     } else {
    //       this.formError = '';
    //     }
    //     this.inputCompleteArray[index] = event.complete;
    //     this.checkIfFormIsComplete();
    //   });
    // });
  }


  mountCardToElement() {
    this.cardElements[0].mount(this.cardNumberElement.nativeElement);
    this.cardElements[1].mount(this.cardExpiryElement.nativeElement);
    this.cardElements[2].mount(this.cardCvcElement.nativeElement);
  }


  onSubmit() {
    if (this.formComplete) {
      this.addSourceToCustomer();
    }
  }


  addSourceToCustomer() {
    this.isLoading = true;
    this.paymentService.addSourceToCustomer(this.customer, this.cardElements[0])
      .subscribe(
        () => {
          this.isLoading = false;
          this.checkoutService.determineState();
        },
        error => {
          console.log(error);
          this.formError = 'Entschuldigung, etwas ist schief gelaufen. Bitte versuchen Sie es noch einmal.';
          this.isLoading = false;
        }
      );
  }

  onChangeDataField(field: 'billing' | 'shipping' | 'payment') {
    this.checkoutService.changeDataField(field);
  }


  onCancel() {
    this.checkoutService.determineState();
  }


  /// helper functions ///


  checkIfFormIsComplete() {
    this.formComplete = this.inputCompleteArray.every(input => {
      return input === true;
    });
  }

}
