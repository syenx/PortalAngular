import { isDefined } from '@angular/compiler/src/util';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { PoModalComponent, PoNotificationService, PoPageAction, PoTableAction, PoTableColumn, PoTableComponent } from '@po-ui/ng-components';
import { PoPageDynamicSearchLiterals } from '@po-ui/ng-templates';
import { Subscription } from 'rxjs';
import { BPOService } from '../../../services/bpo.service';

@Component({
  selector: 'app-tracking-evento',
  templateUrl: './tracking-evento.component.html',
  styleUrls: ['./tracking-evento.component.css']
})
export class TrackingEventoComponent implements OnInit, OnDestroy {

  @ViewChild('table', { static: true }) table: PoTableComponent;
  @ViewChild('modalErro', { static: true }) modalErro: PoModalComponent;

  public erroModal : string = "";

  private roles : any;

  private rowsSub: Subscription;

  private page: number = 1;
  private searchTerm: string = '';
  private searchFilters: any = { };

  public actions: Array<PoPageAction> = [];

  public readonly filters: Array<any> = [
    { property: 'tipoRequisicao', gridColumns: 6, type: 'Status', label: 'Tipo', options:[
      { value: 'PRECO', label: 'Preço' },
      { value: 'CADASTRO', label: 'Cadastro' },
      { value: 'FLUXO', label: 'Fluxo' },
      { value: 'EVENTO', label: 'PU Evento' },
      { value: 'PRECO_HISTORICO', label: 'Preço Histórico' },
    ] },
    { property: 'dataInicioEvento', gridColumns: 6, label: 'Data Início', type: 'date', format: 'dd/MM/yyyy'},
    { property: 'statusEvento', gridColumns: 6, type: 'Status', label: 'Status', options:[
      { value: 'INICIADO', label: 'INICIADO' },
      { value: 'PROCESSANDO', label: 'PROCESSANDO' },
      { value: 'SUCESSO', label: 'SUCESSO' },
      { value: 'ERRO', label: 'ERRO' },
    ] },
    { property: 'usuario', gridColumns: 6, label: 'Usuário'}
  ];;

  public readonly columns: Array<PoTableColumn> = [
    { property: 'idRequisicao', label: 'ID', visible: false },
    { property: 'tipoRequisicao', type: 'label', label: 'Tipo', labels:[
      { value: 'PRECO', color: 'color-01', label: 'Preço' },
      { value: 'CADASTRO', color: 'color-03', label: 'Cadastro' },
      { value: 'FLUXO', color: 'color-06', label: 'Fluxo' },
      { value: 'EVENTO', color: 'color-09', label: 'PU Evento' },
      { value: 'PRECO_HISTORICO', color: 'color-12', label: 'Preço Histórico' },
    ] },
    { property: 'dataInicioEvento', label: 'Data Início', type: 'date', format: 'dd/MM/yyyy HH:mm'},
    { property: 'dataFimEvento', label: 'Data Fim', type: 'date', format: 'dd/MM/yyyy HH:mm'},
    { property: 'metodo', label: 'Método', visible: false },
    { property: 'statusEvento', type: 'label', label: 'Status', labels:[
      { value: 'INICIADO', color: 'color-09', label: 'INICIADO' },
      { value: 'PROCESSANDO', color: 'color-08', label: 'PROCESSANDO' },
      { value: 'SUCESSO', color: 'color-10', label: 'SUCESSO' },
      { value: 'ERRO', color: 'color-07', label: 'ERRO' },
    ] },
    //{ property: 'infoEventoErro', label: 'Mensagem de Erro'},
    { property: 'usuario', label: 'Usuário'}
  ];
  public tableActions: Array<PoTableAction> = [];
  
  public readonly literals: PoPageDynamicSearchLiterals = {
    disclaimerGroupTitle: 'Filtros aplicados:',
    filterTitle: 'Filtro de Eventos',
    filterCancelLabel: 'Fechar',
    filterConfirmLabel: 'Aplicar',
    quickSearchLabel: 'Valor pesquisado:',
    searchPlaceholder: 'Pesquise aqui: Tipo'
  };

  public rows: Array<any> = [];
  public numberofRows: number = 10;
  public hasNext: boolean = false;
  public loading: boolean = true;

  constructor(
    private service: BPOService,
    private router: Router, 
    private poNotification: PoNotificationService, 
    private authService: MsalService) {
    this.roles = (this.authService.getAccount().idToken as any).roles;
    this.updateRolePermissions();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.rowsSub) {
      this.rowsSub.unsubscribe();
    }
  }
  

  updateRolePermissions() {
    this.tableActions = [];
    this.tableActions.push({action: this.details.bind(this), label: 'Detalhes', icon: 'po-icon-info' });
    this.tableActions.push({action: this.expandError.bind(this), label: 'Erro', icon: 'po-icon-credit-payment' });
    this.actions = [];
    this.actions.push({ action: this.onExport.bind(this), label: 'Exportar CSV',icon: 'po-icon-upload', disabled: this.roles == "reader"});    
  }

  private details(row) {
    var url = `/track/${row.idRequisicao}`;
    this.router.navigate([url], { queryParams: { dataInicioEvento: row.dataInicioEvento, usuario: row.usuario}});
    //this.poNotification.success("Navegar para rastreamento papel");
    //this.router.navigateByUrl(`/ativos/view/${row.papel}`);
  }

  private expandError(row)
  {
    if(row.statusEvento == "ERRO")// && row.statusEvento != "SUCESSO")
    {
      if(row.infoEventoErro!= undefined && row.infoEventoErro!="")
      {
        this.erroModal = row.infoEventoErro;
        this.modalErro.open();
      }
      else
      {
        this.poNotification.warning("Erro não disponível");
      }
      
    }
    else
    {
      if(row.statusEvento == "SUCESSO")
      {
        this.poNotification.warning("Essa requisição ocorreu sem nenhum erro");
      }
      else
      {
        this.poNotification.warning("Essa requisição ainda não acabou");
      }
    }
    
  }

  private onExport() {
    //this.poNotification.success("Chamar metodo de export");
    this.service.exportCSVRastreamentoEvento(this.searchFilters);
  }

  changeDisclaimers(event) {

    this.searchTerm = '';
    this.searchFilters = {};

    this.page = 1;
 
    event.forEach(disclaimer => {
      this.searchFilters[disclaimer.property] = disclaimer.value;
    });

    this.loadData(this.searchFilters);

  }

  showMore(event) {
    let params: any = {
      pageNumber: ++this.page,
    };
    
    // if (event) {
    //   params.order = `${event.type === 'ascending' ? '' : '-'}${event.column.property}`;
    // }

    if (this.searchTerm) {
      params.tipoRequisicao = this.searchTerm;
    } else {
      params = { ...params, ...this.searchFilters };
    }
    this.loadData(params);
  }

  private loadData(params: {tipoRequisicao?: string, dataInicioEvento?: string, statusEvento?: string, usuario?: string, pageNumber?: number, pageSize?: number } = { }) {
    this.loading = true;
    this.rowsSub = this.service.getRastreamentoEvento(params)
    .subscribe((response: { hasNext: boolean, items: Array<any>}) => {
      this.rows = !params.pageNumber || params.pageNumber === 1
      ? response.items
      : [...this.rows, ...response.items];
                  
      this.hasNext = response.hasNext;
      this.loading = false;
      // var teste = {message: "", erro: ""};
      // console.log(this.rows);      
      // console.log(JSON.parse(this.rows[10].infoEvento));
      // Object.assign(teste,this.rows[6].infoEvento);
      // console.log(teste);
    });
  }

  public quickSearch(event) {
    this.page = 1;

    var eventFormat = {'tipoRequisicao': event};
    this.searchTerm = event;
    this.searchFilters = {...eventFormat};

    this.loadData(event ? { tipoRequisicao: event } : {});
  }

  public advancedSearch(event) {
    var params = {}
    this.page = 1;
    this.searchTerm = '';

    this.searchFilters = {...event};  
     
    this.loadData(this.searchFilters);
  }

}

