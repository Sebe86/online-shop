import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AppConfigService, ModuleList} from '../app-config.service';
import {AuthenticationService} from '../authentication/services/authentication.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  modules!: ModuleList;
  loadedModules!: ModuleList;
  userAuthenticated = false;

  sideNavShow = false;

  subscriptions: Subscription[] = [];


  constructor(private authenticationService: AuthenticationService,
              private appConfigService: AppConfigService,
              private renderer: Renderer2,
              private route: ActivatedRoute,
              private router: Router) { }


  ngOnInit() {
    this.subscriptions.push(this.authenticationService.getAuthenticationState()
      .subscribe(authenticationState => {
        this.userAuthenticated = authenticationState;
      }));

    this.modules = this.appConfigService.getModulesList();
    this.subscriptions.push(this.appConfigService.getModulesLoadedSubject()
      .subscribe(loadedModules => this.loadedModules = loadedModules));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onToggleSideNav() {
    if (this.sideNavShow) {
      this.sideNavShow = false;
      this.renderer.removeClass(document.body, 'noScroll');
    } else {
      this.sideNavShow = true;
      this.renderer.addClass(document.body, 'noScroll');
    }
  }

  onClickCart() {
    if (this.sideNavShow) {
      this.onToggleSideNav();
    }
  }

  onClickAccount() {
    if (this.userAuthenticated) {
      this.router.navigate(['dashboard']);
    } else {
      let returnUrl: string;
      if (this.route.snapshot.queryParams.returnUrl) {
        returnUrl = this.route.snapshot.queryParams.returnUrl;
      } else {
        returnUrl = this.router.routerState.snapshot.url;
      }

      this.router.navigate(['/authenticate'], { queryParams: { returnUrl}});
    }
    if (this.sideNavShow) {
      this.onToggleSideNav();
    }
  }


}
