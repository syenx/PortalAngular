import { Component, OnDestroy, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { PoModalComponent, PoNotificationService, PoPageAction, PoTableAction, PoTableColumn, PoTableComponent } from '@po-ui/ng-components';
import { PoPageDynamicSearchLiterals } from '@po-ui/ng-templates';
import { Subscription } from 'rxjs';
import { BPOService } from '../../../services/bpo.service';

@Component({
  selector: 'app-tracking-papel',
  templateUrl: './tracking-papel.component.html',
  styleUrls: ['./tracking-papel.component.css']
})
export class TrackingPapelComponent implements OnInit, OnDestroy {

  @ViewChild('table', { static: true }) table: PoTableComponent;
  @ViewChild('modalErro', { static: true }) modalErro: PoModalComponent;

  public erroModal : string = "";

  title: string = "Detalhes do Requisição: "
  requisicao: string;
  dataInicioRequisicao : string;
  usuario : string;

  private roles : any;

  private rowsSub: Subscription;

  private page: number = 1;
  private searchTerm: string = '';
  private searchFilters: any = { };
  private searchFiltersBase: any = { };

  public actions: Array<PoPageAction> = [];

  public readonly filters: Array<any> = [
    { property: 'papel', gridColumns: 6, label: 'Papel' },
    { property: 'statusMensagem', gridColumns: 6, type: 'Status', label: 'Status Papel', options:[
      { value: 'ENVIADO_LUZ', label: 'ENVIADO LUZ' },
      { value: 'RECEBIDO_LUZ', label: 'RECEBIDO LUZ' },
      { value: 'PERSISTIDO_BPO', label: 'PERSISTIDO BPO' },
      { value: 'ENVIADO_MDP', label: 'ENVIADO MDP' },
      { value: 'PROCESSADO_MDP', label: 'PROCESSADO MDP' },
      { value: 'ERRO_MDP', label: 'ERRO MDP' },
      { value: 'FINALIZADO', label: 'SUCESSO' },      
    ] },
  ];;

  public readonly columns: Array<PoTableColumn> = [
    { property: 'idRequisicao', label: 'ID', visible: false },
    { property: 'papel', label: 'Papel' },
    { property: 'dataInicioEvento', label: 'Data Início', type: 'date', format: 'dd/MM/yyyy HH:mm'},
    { property: 'tipoLog', type: 'label', label: 'Tipo', labels:[
      { value: 'PRECO', color: 'color-01', label: 'Preço' },
      { value: 'CADASTRO', color: 'color-03', label: 'Cadastro' },
      { value: 'FLUXO', color: 'color-06', label: 'Fluxo' },
      { value: 'EVENTO', color: 'color-09', label: 'PU Evento' },
      { value: 'PRECO_HISTORICO', color: 'color-12', label: 'Preço Histórico' },
    ] },
    { property: 'statusMensagem', type: 'label', label: 'Status Papel', labels:[
      { value: 'ENVIADO_LUZ', color: 'color-03', label: 'ENVIADO LUZ' },
      { value: 'RECEBIDO_LUZ', color: 'color-01', label: 'RECEBIDO LUZ' },
      { value: 'PERSISTIDO_BPO', color: 'color-08', label: 'PERSISTIDO BPO' },
      { value: 'ENVIADO_MDP', color: 'color-08', label: 'ENVIADO MDP' },
      { value: 'PROCESSADO_MDP', color: 'color-09', label: 'PROCESSADO MDP' },
      { value: 'ERRO_MDP', color: 'color-07', label: 'ERRO MDP' },
      { value: 'FINALIZADO', color: 'color-10', label: 'FINALIZADO' },      
    ] },
    { property: 'statusPapel', type: 'label', label: 'Status Evento', visible: false, labels:[
      { value: 'INICIADO', color: 'color-09', label: 'INICIADO' },
      { value: 'PROCESSANDO', color: 'color-08', label: 'PROCESSANDO' },
      { value: 'SUCESSO', color: 'color-10', label: 'SUCESSO' },
      { value: 'ERRO', color: 'color-07', label: 'ERRO' },
    ] },
    { property: 'dataFimEvento', label: 'Data Fim', type: 'date', format: 'dd/MM/yyyy HH:mm'},
    
  ];

  public tableActions: Array<PoTableAction> = [];

  public readonly literals: PoPageDynamicSearchLiterals = {
    disclaimerGroupTitle: 'Filtros aplicados:',
    filterTitle: 'Filtro de Papeis',
    filterCancelLabel: 'Fechar',
    filterConfirmLabel: 'Aplicar',
    quickSearchLabel: 'Valor pesquisado:',
    searchPlaceholder: 'Pesquise aqui: Papel'
  };

  public rows: Array<any> = [];
  public numberofRows: number = 10;
  public hasNext: boolean = false;
  public loading: boolean = true;

  constructor(
    private service: BPOService,
    private route: ActivatedRoute,
    private router: Router, 
    private poNotification: PoNotificationService, 
    private authService: MsalService) {
    this.roles = (this.authService.getAccount().idToken as any).roles;
    this.updateRolePermissions();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params =>this.requisicao = params.idRequisicao);
    this.route.queryParams.subscribe(params => {
      this.dataInicioRequisicao = params.dataInicioEvento;
      this.usuario = params.usuario;
    });
    this.title = this.title + "#" + this.requisicao.slice(0,8) + " - " + this.usuario;
    this.searchFiltersBase = { idRequisicao: this.requisicao, dataInicioEvento: this.dataInicioRequisicao };
    this.loadData(this.searchFiltersBase);
  }

  ngOnDestroy() {
    if (this.rowsSub) {
      this.rowsSub.unsubscribe();
    }
  }

  updateRolePermissions() {
    this.tableActions = [];
    this.tableActions.push({action: this.expandError.bind(this), label: 'Erro', icon: 'po-icon-credit-payment' });
    this.actions = [];
    this.actions.push({ action: this.onExport.bind(this), label: 'Exportar CSV',icon: 'po-icon-upload', disabled: this.roles == "reader"});
    this.actions.push({ action: this.backToTracking.bind(this), label: 'Voltar'});
  }

  private expandError(row)
  {
    if(row.statusPapel == "ERRO")// && row.statusEvento != "SUCESSO")
    {
      if(row.mensagemErro!= undefined && row.mensagemErro!="")
      {
        this.erroModal = row.mensagemErro;
        this.modalErro.open();
      }
      else
      {
        this.poNotification.warning("Erro não disponível");
      }
      
    }
    else
    {
      if(row.statusPapel == "SUCESSO")
      {
        this.poNotification.warning("Esse dado foi processado sem erros");
      }
      else
      {
        this.poNotification.warning("O processamento desse dado ainda não acabou");
      }
    }
    
  }

  private onExport() {
    //this.poNotification.success("Chamar metodo de export");
    this.service.exportCSVRastreamentoPapel({ ...this.searchFiltersBase, ...this.searchFilters });
  }

  private backToTracking()  {
    this.router.navigateByUrl('/track');
  }

  changeDisclaimers(event) {

    this.searchTerm = '';
    this.searchFilters = {};

    this.page = 1;
 
    event.forEach(disclaimer => {
      this.searchFilters[disclaimer.property] = disclaimer.value;
    });

    this.loadData({ ...this.searchFiltersBase, ...this.searchFilters });

  }

  showMore(event) {
    let params: any = {
      pageNumber: ++this.page,
    };
    params = { ...params, ...this.searchFiltersBase};
    
    // if (event) {
    //   params.order = `${event.type === 'ascending' ? '' : '-'}${event.column.property}`;
    // }

    if (this.searchTerm) {
      params.papel = this.searchTerm;
    } else {
      params = { ...params, ...this.searchFilters };
    }
    this.loadData(params);
  }

  private loadData(params: {dataInicioEvento?: string, idRequisicao?: string, papel?: string, statusPapel?: string, pageNumber?: number, pageSize?: number } = { }) {
    this.loading = true;
    this.rowsSub = this.service.getRastreamentoPapel(params)
    .subscribe((response: { hasNext: boolean, items: Array<any>}) => {
      this.rows = !params.pageNumber || params.pageNumber === 1
      ? response.items
      : [...this.rows, ...response.items];
                  
      this.hasNext = response.hasNext;
      this.loading = false;
    });
  }

  public quickSearch(event) {
    this.page = 1;

    var eventFormat = {'papel': event};
    this.searchTerm = event;
    this.searchFilters = {...eventFormat};

    var params = event ? { papel: event } : {};
    params = { ...params, ...this.searchFiltersBase};

    this.loadData(params);
  }

  public advancedSearch(event) {
    var params = {}
    this.page = 1;
    this.searchTerm = '';

    this.searchFilters = {...event};  
     
    this.loadData({ ...this.searchFilters, ...this.searchFiltersBase});
  }

}
