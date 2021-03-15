import {Component} from '@angular/core';
import {AppConfigService} from './app-config.service';
import {AuthenticationService} from './authentication/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // These services are essential, services inside the constructor get initialised at app start.
  constructor(private appConfigService: AppConfigService,
              private authenticationService: AuthenticationService) { }


}
