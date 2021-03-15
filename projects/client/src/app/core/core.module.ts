import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AuthenticationModule} from '../authentication/authentication.module';
import {ShopModule} from '../shop/shop.module';
import {ContentModule} from '../content/content.module';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {CommonModule} from '@angular/common';
import {AngularFireFunctionsModule} from '@angular/fire/functions';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AuthenticationModule,
    ShopModule,
    ContentModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule
  ],
  declarations: [],
  providers: []
})
export class CoreModule { }
