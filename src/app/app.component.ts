import { Component, OnInit, ViewChild } from '@angular/core';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { PoMenuItem, PoToolbarAction, PoToolbarProfile } from '@po-ui/ng-components';
import { CryptoUtils, Logger } from 'msal';
import { Env, EnvConfig } from './components/env-config/env-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  isIframe = false;
  loggedIn = false;
  roles : any = [];
  
  title : string;
  ambiente : string;
  env: Env;
  
  profile: PoToolbarProfile = {
    subtitle: 'no-user@btgpactual.com',
    title: 'Unknown',
    avatar : '/assets/avatar_User.PNG'
  };
  
  profileActions: Array<PoToolbarAction> = [
    //{ icon: 'po-icon-exit', label: 'Logout', type: 'danger', separator: true, action: item => console.log("Logout") }
  ];
  
  readonly menus: Array<PoMenuItem> = [
    { label: 'Home', link: '/home', icon: "po-icon-home", shortLabel: "Home" },
    { label: 'Papéis Assinados', link: '/ativos', icon: "po-icon-list", shortLabel: "Assinaturas"},
    { label: 'Busca por papel', link: '/buscapapel', icon: "po-icon-search", shortLabel: "Busca"},
    { label: 'Preços', link: '/precos', icon: "po-icon-finance", shortLabel: "Preços"},
    { label: 'Tracking', link: '/track', icon: "po-icon-history", shortLabel: "Tracking"},
    { label: 'Painel de Controle', link: '/controlPanel', icon: "po-icon-settings", shortLabel: "Outros"}
  ];
  
  constructor(envConfig: EnvConfig, private broadcastService: BroadcastService, private authService: MsalService) {
    envConfig.getEnv().then(
      (env: Env) => {
        this.env = env;
        this.ambiente = env.ambiente;
        this.title = "BPO - BTG Pactual - "+ this.ambiente;
      }
    );
  }
  ngOnInit(): void {
    this.title = "BPO - BTG Pactual";
    this.isIframe = window !== window.parent && !window.opener;
    
    this.checkAccount();
    
    this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.checkAccount();
      window.location.reload();
    });
    
    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }
      
      console.log('Redirect Success: ', response.accessToken);
    });
    
    this.authService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));

    this.updateProfileInfo();
  }
  checkAccount() {
    this.loggedIn = !!this.authService.getAccount();
    if(this.loggedIn) {
      this.roles = (this.authService.getAccount().idToken as any).roles;
    }
  }

  logout() {
    this.authService.logout();
  }

  login() {
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    
    if (isIE) {
      this.authService.loginRedirect({
        extraScopesToConsent: ["user.read", "openid", "profile"]
      });
    } else {
      this.authService.loginPopup({
        extraScopesToConsent: ["user.read", "openid", "profile"]
      });
    }
  }

  updateProfileInfo()
  {
    if(this.loggedIn) {
      this.profileActions.push({ icon: 'po-icon-exit', label: 'Logout', type: 'danger', separator: true, action: this.logout.bind(this) });
      this.profile.title = this.authService.getAccount().name;
      this.profile.subtitle = this.authService.getAccount().userName;
      this.profile.avatar = '/assets/avatar_User.PNG'
    }
    else {
      this.profileActions.push({ icon: 'po-icon-user', label: 'Login', separator: true, action: this.login.bind(this) });
    }
  }
    
    
  }