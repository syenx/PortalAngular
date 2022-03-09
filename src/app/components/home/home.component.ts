import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { PoNotificationService, PoChartType, PoChartGaugeSerie } from '@po-ui/ng-components';
import { formatDate } from '@angular/common';
import { BPOService } from '../../services/bpo.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  isIframe = false;
  loggedIn = false;
  roles : any = [];

  titleCharts: string;
  isChartLoading : boolean = true;

  chartsType: PoChartType = PoChartType.Gauge;
  
  cadastroSeries: Array<PoChartGaugeSerie> = [];  
  precoSeries: Array<PoChartGaugeSerie> = [];
  eventoSeries: Array<PoChartGaugeSerie> = [];
  
  constructor(private authService: MsalService, 
              private poNotification: PoNotificationService,
              private service: BPOService ) { }
  
  ngOnInit() {
    this.checkAccount()
    if(this.loggedIn)
    {
      this.refreshDashboardsData();
    }
    else
    {
      this.isChartLoading = false;
      this.poNotification.error("O usuário precisa estar logado para ver os dados das dashboards");
    }    
    this.titleCharts = formatDate(new Date(),'dd/MM/yyyy','pt','-0300');
  }

  checkAccount() {
    this.loggedIn = !!this.authService.getAccount();
    if(this.loggedIn) {
      this.roles = (this.authService.getAccount().idToken as any).roles;
    }
  }

  refreshDashboardsData() {
    this.service.getDashboardData({tipoRequisicao:'CADASTRO'}).subscribe((response) => {
      this.cadastroSeries = [];
      var marcadosPorcent = response.qtdMarcados==0? 0 : 100*response.qtdImpactados/response.qtdMarcados;
      this.cadastroSeries.push({ description: `${response.qtdImpactados}/${response.qtdMarcados}`, value: marcadosPorcent, color: 'color-10' });
    });
    this.service.getDashboardData({tipoRequisicao:'PRECO'}).subscribe((response) => {
      this.precoSeries = [];
      var marcadosPorcent = response.qtdMarcados==0? 0 : 100*response.qtdImpactados/response.qtdMarcados;
      this.precoSeries.push({ description: `${response.qtdImpactados}/${response.qtdMarcados}`, value: marcadosPorcent, color: 'color-10' });
    });
    this.service.getDashboardData({tipoRequisicao:'EVENTO'}).subscribe((response) => {
      this.eventoSeries = [];
      var marcadosPorcent = response.qtdMarcados==0? 0 : 100*response.qtdImpactados/response.qtdMarcados;
      this.eventoSeries.push({ description: `${response.qtdImpactados}/${response.qtdMarcados}`, value: marcadosPorcent, color: 'color-10' });
      this.isChartLoading = false;
    });
    
  }
  
}
