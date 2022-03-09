import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListaAtivosComponent } from './components/listaAtivos/listaAtivos.component';
import { EditAtivoComponent } from './components/editAtivo/editAtivo.component';
import { AuthGuard } from './guards/auth.guard';
import { Role } from './models/Role';
import { MsalGuard } from '@azure/msal-angular';
import { EditAtivoLoteComponent } from './components/edit-ativo-lote/edit-ativo-lote.component';
import { BuscaAtivoComponent } from './components/busca-ativo/busca-ativo.component';
import { PageDetailComponent } from './components/page-detail/page-detail.component';
import { PrecosComponent } from './components/precos/precos.component';
import { TrackingEventoComponent } from './components/tracking-page/tracking-evento/tracking-evento.component';
import { TrackingPapelComponent } from './components/tracking-page/tracking-papel/tracking-papel.component';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch : 'full'},
  { path: 'home', component: HomeComponent},
  { path:'buscapapel', component: BuscaAtivoComponent, canActivate: [MsalGuard]},
  { path:'ativos', component: ListaAtivosComponent, canActivate: [MsalGuard]},
  { path:'ativos/new', component: EditAtivoComponent,data : {roles : ['admin','editor']}, canActivate: [MsalGuard, AuthGuard]},
  { path:'ativos/newLote', component: EditAtivoLoteComponent,data : {roles : ['admin','editor']}, canActivate: [MsalGuard, AuthGuard]},
  { path:'ativos/view/:papel', component: PageDetailComponent, canActivate: [MsalGuard]},
  { path:'precos', component: PrecosComponent, canActivate: [MsalGuard]},
  { path:'track', component: TrackingEventoComponent, canActivate: [MsalGuard]},
  { path:'track/:idRequisicao', component: TrackingPapelComponent, canActivate: [MsalGuard]},
  { path:'controlPanel', component: ControlPanelComponent, canActivate: [MsalGuard]},
  // { path:'ativos/edit/:id', component: EditAtivoComponent},
  // { path:'ativosOLD', component: DynV2Component, canActivate: [MsalGuard]},
  //{ path: 'auth-callback', component: AuthCallbackComponent }
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
