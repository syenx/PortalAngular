import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { RouterModule } from '@angular/router';
import { PoTemplatesModule } from '@po-ui/ng-templates'

import { HomeComponent } from './components/home/home.component';
import { ListaAtivosComponent } from './components/listaAtivos/listaAtivos.component';
import { EditAtivoComponent } from './components/editAtivo/editAtivo.component';
import { MsalInterceptor, MsalModule } from '@azure/msal-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EditAtivoLoteComponent } from './components/edit-ativo-lote/edit-ativo-lote.component';
import { BuscaAtivoComponent } from './components/busca-ativo/busca-ativo.component';
import { DetalhePapelComponent } from './components/detalhe-papel/detalhe-papel.component';
import { PageDetailComponent } from './components/page-detail/page-detail.component';
import { CSVHeaderInterceptor } from './interceptors/csvheader.interceptor';
import { PrecosComponent } from './components/precos/precos.component';

import { LOCALE_ID } from '@angular/core'
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResumoAssinaturaComponent } from './components/detalhe-papel/resumo-assinatura/resumo-assinatura.component';
import { PrecosFiltersInterceptor } from './interceptors/precosFilters.interceptor';
import { TrackingEventoComponent } from './components/tracking-page/tracking-evento/tracking-evento.component';
import { TrackingPapelComponent } from './components/tracking-page/tracking-papel/tracking-papel.component';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';

registerLocaleData(localePt);

declare var require: any;
const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
const env = require('../app/components/env-config/env-config.json')[window.location.hostname]; 

@NgModule({
  declarations: [						
    AppComponent,
    HomeComponent,
    ListaAtivosComponent,
    EditAtivoComponent,
    EditAtivoLoteComponent,
    BuscaAtivoComponent,
    DetalhePapelComponent,
    PageDetailComponent,
    PrecosComponent,
    ResumoAssinaturaComponent,
    TrackingEventoComponent,
    TrackingPapelComponent,
    ControlPanelComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PoModule,
    FormsModule,
    ReactiveFormsModule,
    PoTemplatesModule,
    RouterModule.forRoot([]),
    MsalModule.forRoot({
      auth: {
        clientId: env.clientId,
        authority: env.authority,
        redirectUri: env.redirectUri,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      },
    }, {
      popUp: !isIE,
      consentScopes: [
        'user.read',
        'openid',
        'profile',
      ],
      unprotectedResources: [],
      protectedResourceMap: [
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ],
      extraQueryParameters: {}
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, 
      useClass: CSVHeaderInterceptor, 
      multi: true 
    },
    { provide: HTTP_INTERCEPTORS, 
      useClass: PrecosFiltersInterceptor, 
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
