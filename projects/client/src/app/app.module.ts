import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import {CoreModule} from './core/core.module';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import {CommonModule} from '@angular/common';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
