import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface ModuleList {
  shop: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  appModulesList: ModuleList = {
    shop: true
  };

  appModulesLoaded: ModuleList = {
    shop: false
  };

  modulesLoaded!: BehaviorSubject<any>;

  constructor() {
    this.initAppConfig();
  }


  initAppConfig() {
    this.modulesLoaded = new BehaviorSubject(this.appModulesLoaded);
  }

  getModulesList() {
    return this.appModulesList;
  }

  getModulesLoadedSubject() {
    return this.modulesLoaded;
  }

  loadModule(module: keyof ModuleList) {
    this.appModulesLoaded[module as keyof ModuleList] = true;
    this.modulesLoaded.next(this.appModulesLoaded);
  }

}
