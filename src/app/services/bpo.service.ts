import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Observable, Subscription } from 'rxjs';
import { EndpointsApi } from '../models/EndpointsApi'

@Injectable({
  providedIn: 'root'
})
export class BPOService {

  constructor(
    private httpClient: HttpClient,
    private apiConfig: EndpointsApi,
    private authService: MsalService) {}

  getAtivosAssinados(params: { page?: number, papel?: string, impactaCadastro?: boolean, impactaPreco?: boolean, impactaEvento?: boolean, impactaHistorico?: boolean, dataAssinatura?: string } = { }) : Observable<any> {
    return this.httpClient.get(this.apiConfig.AssinaturaURL(),{ params: <any>params });
  }

  deleteAtivoAssinado(items: any,header: {user?: string } = { }): Observable<any> {
    header.user = this.authService.getAccount().userName;
    var rowEditDelete: any = {"items": []};
    rowEditDelete.items = items;
    return this.httpClient.request('delete',this.apiConfig.AssinaturaURL(), {body: rowEditDelete, headers: <any>header });
  }

  assinatura(row = {},header: {user?: string } = { }): Observable<any> {
    header.user = this.authService.getAccount().userName ;
    return this.httpClient.post(this.apiConfig.AssinaturaURL(),row, { headers: <any>header });
  }
  assinaturaloteURL(): string {
    return this.apiConfig.AssinaturaCSVURL();
  }

  cadastroLoteURL(): string {
    return this.apiConfig.CadastroLoteURL();
  }

  getPapelInfo(papel: string) : Observable<any> {
    return this.httpClient.get(this.apiConfig.getAssinaturaPapelURL(papel));
  }

  getCadastro(papel: string) : Observable<any> {
    return this.httpClient.get(this.apiConfig.getCaracteristicaPapel(papel));
  }

  getLogInfo(params: {papel?: string } = { }) : Observable<any> {
    return this.httpClient.get(this.apiConfig.getLogURL(),{ params: <any>params });
  }

  downloadCSV(dataURI = '/assets/template.csv', nomeArquivo = 'templateAssinaturaLote.csv') {
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataURI);
    linkElement.setAttribute('download', nomeArquivo);
    linkElement.click();

  }
  downloadCSVCadastro(dataURI = '/assets/templateCadastroEmLote.csv', nomeArquivo = 'templateCadastroLote.csv') {
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataURI);
    linkElement.setAttribute('download', nomeArquivo);
    linkElement.click();

  }
  exportCSVAssinatura(params: { page?: number, papel?: string, impactaMdp?: boolean, dataAssinatura?: string } = { }) : Subscription {
    var sub = this.httpClient.get(this.apiConfig.AssinaturaCSVURL(),{params: <any>params ,responseType: 'text'})
    .subscribe(data =>{
      const dataURI = 'data:text/csv;charset=utf-8,'+encodeURIComponent(data);
      const exportfileName = 'AssinaturasLuz.csv';
      this.downloadCSV(dataURI,exportfileName);
    });
    return sub;
  }

  getRelatorioPreco() : string {
    return this.apiConfig.RelatorioPreco();
  }

  getRelatorioDiaPreco(header: {user?: string } = { }) : Observable<any> {
    header.user = this.authService.getAccount().userName;
    return this.httpClient.get(this.apiConfig.RelatorioDiaPreco(),{headers: <any>header });
  }

  getRelatorioPuDeEventos(header: {user?: string } = { }): Observable<any> {
    header.user = this.authService.getAccount().userName;
    return this.httpClient.get(this.apiConfig.RelatorioDiaPuDeEventos(),{headers: <any>header });
  }

  getDashboardPreco() : Observable<any> {
    return this.httpClient.get(this.apiConfig.DashboardPreco());
  }

  getPrecoInfo(papel: string, params: {page?: number, pageSize?:number, dateStart?:string, dateEnd?:string, timeStartSTR?:string, timeEndSTR?:string} = { }) : Observable<any> {
    return this.httpClient.get(this.apiConfig.getPrecoPapelURL(papel),{ params: <any>params });
  }

  exportCSVPreco(params: {dia?: boolean} = { }) {
    this.httpClient.get(this.apiConfig.PrecoCSVURL(),{params: <any>params ,responseType: 'text'})
    .subscribe(data =>{
      const dataURI = 'data:text/csv;charset=utf-8,'+encodeURIComponent(data);
      const exportfileName = 'PrecosLuz.csv';
      this.downloadCSV(dataURI,exportfileName);
    });
  }
  exportCSVPrecoHist(params: {papel: string, dateStart?:string, dateEnd?:string, timeStartSTR?:string, timeEndSTR?:string}) {
    this.httpClient.get(this.apiConfig.PrecoHistCSVURL(),{params: <any>params ,responseType: 'text'})
    .subscribe(data =>{
      const dataURI = 'data:text/csv;charset=utf-8,'+encodeURIComponent(data);
      const exportfileName = 'HistPreco'+params.papel+'.csv';
      this.downloadCSV(dataURI,exportfileName);
    });
  }

  getFluxoInfo(papel: string, params: {data?:string, page?: number, pageSize?:number} = { }, header: {user?: string } = { }) : Observable<any> {
    header.user = this.authService.getAccount().userName;
    return this.httpClient.get(this.apiConfig.getFluxoPapelURL(papel),{ params: <any>params, headers: <any>header });
  }


  getRelatorioTracking() : string {
    return this.apiConfig.Rastreamento();
  }

  getPapelTypes() : Observable<any> {
    return this.httpClient.get(this.apiConfig.TipoPapelURL());
  }
  getLastAttPreco(params: {papel?: string} = { }) : Observable<any> {
    return this.httpClient.get(this.apiConfig.LastAttPrecoURL(),{ params: <any>params });
  }

  exportCSVCadastro(params: { data?: string } = {}) : Observable<any> {
    return this.httpClient.get(this.apiConfig.CadastroCSVURL(), { params: <any>params, responseType: 'text' })
  }

  exportCSVFluxo(params: { data?: string } = {}): Observable<any> {
    return this.httpClient.get(this.apiConfig.FluxoCSVURL(), { params: <any>params, responseType: 'text' })
  }

  getRelatorioDiaCaracteristica(header: {user?: string } = { }) : Observable<any> {
    header.user = this.authService.getAccount().userName;
    return this.httpClient.get(this.apiConfig.RelatorioDiaCaracteristica(), { headers: <any>header });
  }

  getCadastroUnitario(papel: string, header: {user?: string } = { }) : Observable<any> {
    header.user = this.authService.getAccount().userName;
    return this.httpClient.get(this.apiConfig.CadastroUnitarioURL(papel), { headers: <any>header });
  }
  getPrecoHistoricoUnitario(papel: string, header: {user?: string } = { }): Observable<any> {
    header.user = this.authService.getAccount().userName;
    return this.httpClient.get(this.apiConfig.PrecoHistoricoUnitarioURL(papel), { headers: <any>header });
  }
  getPuDeEventosUnitario(papel: string, header: {user?: string } = { }): Observable<any> {
    header.user = this.authService.getAccount().userName;
    return this.httpClient.get(this.apiConfig.PuDeEventosUnitarioURL(papel), { headers: <any>header });
  }

  getRastreamentoEvento(params: {tipoRequisicao?: string, dataInicioEvento?: string, statusEvento?: string, usuario?: string, pageNumber?: number, pageSize?: number } = { }) : Observable<any> {
    return this.httpClient.get(this.apiConfig.RastreamentoEventoURL(),{ params: <any>params });
  }

  getRastreamentoPapel(params: {dataInicioEvento?: string, idRequisicao?: string, papel?: string, statusPapel?: string, pageNumber?: number, pageSize?: number } = { }) : Observable<any> {
    return this.httpClient.get(this.apiConfig.RastreamentoPapelURL(),{ params: <any>params });
  }

  disasterRecovery(params: {data?:string} = { }, header: {user?: string } = { }) : Observable<any> {
    header.user = this.authService.getAccount().userName;
    return this.httpClient.get(this.apiConfig.DisasterRecoveryURL(),{ params: <any>params, headers: <any>header });
  }

  disasterRecoveryUnitario(papel: string, params: {data?:string} = { }, header: {user?: string } = { }) : Observable<any> {
    header.user = this.authService.getAccount().userName;
    return this.httpClient.get(this.apiConfig.DisasterRecoveryUnitarioURL(papel),{ params: <any>params, headers: <any>header });
  }

  exportCSVRastreamentoEvento(params: {tipoRequisicao?: string, dataInicioEvento?: string, statusEvento?: string, usuario?: string} = { }) : Subscription {
    var sub = this.httpClient.get(this.apiConfig.RastreamentoEventoCSVURL(),{params: <any>params ,responseType: 'text'})
    .subscribe(data =>{
      const dataURI = 'data:text/csv;charset=utf-8,'+encodeURIComponent(data);
      const exportfileName = 'EventosDoDia.csv';
      this.downloadCSV(dataURI,exportfileName);
    });
    return sub;
  }

  exportCSVRastreamentoPapel(params: {dataInicioEvento?: string, idRequisicao?: string, papel?: string, statusPapel?: string } = { }) : Subscription {
    var sub = this.httpClient.get(this.apiConfig.RastreamentoPapelCSVURL(),{params: <any>params ,responseType: 'text'})
    .subscribe(data =>{
      const dataURI = 'data:text/csv;charset=utf-8,'+encodeURIComponent(data);
      const exportfileName = 'Requisicao' + params.idRequisicao.slice(0,8) + '-Papeis' + '.csv';
      this.downloadCSV(dataURI,exportfileName);
    });
    return sub;
  }

  getDashboardData(params: {data?: string, tipoRequisicao?: string } = { }) : Observable<any> {
    return this.httpClient.get(this.apiConfig.DashboardsURL(),{ params: <any>params });
  }

}
