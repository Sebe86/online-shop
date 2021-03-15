import {Component, OnInit} from '@angular/core';
import 'firebase/firestore';
import {AppConfigService} from '../app-config.service';
import {CustomerService} from './services/customer.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  constructor(private appConfigService: AppConfigService,
              private customerService: CustomerService) { }

  ngOnInit() {
    this.appConfigService.loadModule('shop');
  }

}
