import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { PoButtonGroupItem, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoTableAction, PoTableColumn, PoTableComponent, PoUploadComponent, PoUploadLiterals} from '@po-ui/ng-components';
import { PoPageDynamicSearchLiterals } from '@po-ui/ng-templates';

import { MsalService } from '@azure/msal-angular';
import { BPOService } from '../../services/bpo.service';

@Component({
  selector: 'app-listaAtivos',
  templateUrl: './listaAtivos.component.html',
  styleUrls: ['./listaAtivos.component.css'],
  providers: [BPOService]
})

export class ListaAtivosComponent implements OnInit, OnDestroy {

  @ViewChild('loteMod') loteMod: PoModalComponent;
  @ViewChild('UploadCSVComp') UploadCSVComp: PoUploadComponent;
  
  private roles : any;
  
  private rowRemoveSub: Subscription;
  private rowsRemoveSub: Subscription;
  private rowsSub: Subscription;
  private exportSub: Subscription;

  private page: number = 1;
  private searchTerm: string = '';
  private searchFilters: any = { };
  
  public actions: Array<PoPageAction> = [];
  
  public readonly filters: Array<any> = [
    { property: 'papel', label: 'Código Ativo', gridColumns: 6 },
    { property: 'dataAssinatura', label: 'Data de Assinatura', type: 'date', format: 'dd/MM/yyyy', gridColumns: 6 },
    { property: 'impactaCadastro', type: 'Status',label: 'Cadastro', gridColumns: 6, options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Não', label: 'Não'}
    ]},
    { property: 'impactaPreco', type: 'Status',label: 'Preço do dia', gridColumns: 6, options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Não', label: 'Não'}
    ]},
    { property: 'impactaEvento', type: 'Status',label: 'PU Eventos', gridColumns: 6, options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Não', label: 'Não'}
    ]},
    { property: 'impactaHistorico', type: 'Status',label: 'Preço Histórico', gridColumns: 6, options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Não', label: 'Não'}
    ]}    
  ];
  
  public readonly columns: Array<PoTableColumn> = [
    { property: 'papel', label: 'Código Ativo' },
    { property: 'dataAssinatura', label: 'Data de Assinatura', type: 'date', format: 'dd/MM/yyyy'},
    { property: 'impactaCadastro', type: 'label', label: 'Cadastro', labels:[
      { value: 'Sim', color: 'color-10', label: 'Sim' },
      { value: 'Não', color: 'color-07', label: 'Não' }
    ]},
    { property: 'impactaPreco', type: 'label', label: 'Preço do dia', labels:[
      { value: 'Sim', color: 'color-10', label: 'Sim' },
      { value: 'Não', color: 'color-07', label: 'Não' }
    ]},
    { property: 'impactaEvento', type: 'label', label: 'PU Eventos', labels:[
      { value: 'Sim', color: 'color-10', label: 'Sim' },
      { value: 'Não', color: 'color-07', label: 'Não' }
    ]},
    { property: 'impactaHistorico', type: 'label', label: 'Preço Histórico', labels:[
      { value: 'Sim', color: 'color-10', label: 'Sim' },
      { value: 'Não', color: 'color-07', label: 'Não' }
    ]}
  ];
  
  public loadingAssLote : boolean = false;
  public tableActions: Array<PoTableAction> = [];
  
  public readonly literals: PoPageDynamicSearchLiterals = {
    disclaimerGroupTitle: 'Filtros aplicados:',
    filterTitle: 'Filtro de Ativos',
    filterCancelLabel: 'Fechar',
    filterConfirmLabel: 'Aplicar',
    quickSearchLabel: 'Valor pesquisado:',
    searchPlaceholder: 'Pesquise aqui'
  };
  

  public rows: Array<any> = [];
  public numberofRows: number = 10;
  public hasNext: boolean = false;
  public loading: boolean = true;

  public sign_url_lote: string;
  public restrictions = { allowedExtensions: ['.csv'] }; //,'.xlsx'
  customLiterals: PoUploadLiterals = {
    folders: 'Pastas',
    selectFile: 'Buscar arquivo',
    startSending: 'Enviar',
    sentWithSuccess: 'Enviado com sucesso'
   };

  return: PoModalAction = {
    action: () => {
      this.UploadCSVComp.clear();
      this.loteMod.close();
      window.location.reload();
    },
    label: 'Voltar'
  }; 

  @ViewChild('table', { static: true }) table: PoTableComponent;
  
  constructor(
    private service: BPOService,
    private router: Router, 
    private poNotification: PoNotificationService, 
    private authService: MsalService) {
    this.roles = (this.authService.getAccount().idToken as any).roles;
    this.updateRolePermissions();
  }
  
  ngOnInit() {
    this.loadData();
    this.sign_url_lote = this.service.assinaturaloteURL();
  }
  
  ngOnDestroy() {

    if (this.rowsSub) {
      this.rowsSub.unsubscribe();
    }

    if (this.rowRemoveSub) {
      this.rowRemoveSub.unsubscribe();
    }
    
    if (this.rowsRemoveSub) {
      this.rowsRemoveSub.unsubscribe();
    }

    if (this.exportSub) {
      this.exportSub.unsubscribe();
    }
  }
  updateRolePermissions() {
    this.tableActions = [];
    this.tableActions.push({action: this.onRemoveRow.bind(this), label: 'Remover', type: 'danger', icon: 'po-icon-delete', separator: true, disabled: this.roles == "reader"});
    this.tableActions.push({action: this.details.bind(this), label: 'Detalhes', icon: 'po-icon-info' });
    this.actions = [];
    this.actions.push({ action: this.onNewRow.bind(this), label: 'Cadastrar', icon: 'po-icon-user-add', disabled: this.roles == "reader" });
    this.actions.push({ action: this.onRemoveRows.bind(this), label: 'Remover', type: 'danger',icon: 'po-icon-delete', disabled: this.roles == "reader" });
    this.actions.push({ action: this.onNewRows.bind(this), label: 'Cadastrar em Lote (CSV)',icon: 'po-icon-user-add',disabled:  this.roles == "reader"});
    this.actions.push({ action: this.onExport.bind(this), label: 'Exportar CSV',icon: 'po-icon-upload' });
  }
  changeDisclaimers(event) {

    this.searchTerm = '';
    this.searchFilters = {};

    this.page = 1;
 
    event.forEach(disclaimer => {
      this.searchFilters[disclaimer.property] = disclaimer.value;
    });
    if(this.searchFilters.impactaCadastro != null) {
      this.searchFilters.impactaCadastro = this.searchFilters.impactaCadastro=="Sim"? true : false;
    }
    if(this.searchFilters.impactaPreco != null) {
      this.searchFilters.impactaPreco = this.searchFilters.impactaPreco=="Sim"? true : false;
    }
    if(this.searchFilters.impactaEvento != null) {
      this.searchFilters.impactaEvento = this.searchFilters.impactaEvento=="Sim"? true : false;
    }
    if(this.searchFilters.impactaHistorico != null) {
      this.searchFilters.impactaHistorico = this.searchFilters.impactaHistorico=="Sim"? true : false;
    }
    this.loadData(this.searchFilters);

  }
  
  sortBy(event) {    
    this.page = 1;
    
    if (event) {
      this.searchFilters.order = `${event.type === 'ascending' ? '' : '-'}${event.column.property}`;
    }
        
    this.loadData(this.searchFilters);
  }
  
  showMore(event) {
    let params: any = {
      page: ++this.page,
    };
    
    if (event) {
      params.order = `${event.type === 'ascending' ? '' : '-'}${event.column.property}`;
    }

    if (this.searchTerm) {
      params.papel = this.searchTerm;
    } else {
      params = { ...params, ...this.searchFilters };
    }
    this.loadData(params);
  }
  
  private loadData(params: { page?: number, papel?: string, impactaCadastro?: boolean, impactaPreco?: boolean, impactaEvento?: boolean, impactaHistorico?: boolean, dataAssinatura?: string } = { }) {
    this.loading = true;
    this.rowsSub = this.service.getAtivosAssinados(params)
    .subscribe((response: { hasNext: boolean, items: Array<any>}) => {
      this.rows = !params.page || params.page === 1
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

    this.loadData(event ? { papel: event } : {});
  }
  
  public advancedSearch(event) {
    var params = {}
    this.page = 1;
    this.searchTerm = '';

    this.searchFilters = {...event};  
    
    if(this.searchFilters.impactaCadastro != null) {
      this.searchFilters.impactaCadastro = this.searchFilters.impactaCadastro=="Sim"? true : false;
    }
    if(this.searchFilters.impactaPreco != null) {
      this.searchFilters.impactaPreco = this.searchFilters.impactaPreco=="Sim"? true : false;
    }
    if(this.searchFilters.impactaEvento != null) {
      this.searchFilters.impactaEvento = this.searchFilters.impactaEvento=="Sim"? true : false;
    }
    if(this.searchFilters.impactaHistorico != null) {
      this.searchFilters.impactaHistorico = this.searchFilters.impactaHistorico=="Sim"? true : false;
    }
     
    this.loadData(this.searchFilters);
  }
  
  private onNewRow() {
    this.router.navigateByUrl('/ativos/new');
  }
  private onNewRows() {
    this.loteMod.open();
  }

  private details(row) {
    this.router.navigateByUrl(`/ativos/view/${row.papel}`);
  }
  
  private onRemoveRow(row) {
    const items: any = [{'papel' : row.papel}];
    this.rowRemoveSub = this.service.deleteAtivoAssinado(items)
    .subscribe(() => {
      this.poNotification.success('Ativo apagado com sucesso.');
      
      this.rows.splice(this.rows.indexOf(row), 1);
    });
  }
  
  private onRemoveRows() {
    const selectedrows = this.table.getSelectedRows();
    const items = selectedrows.map(row => ({ papel: row.papel}));
    this.rowsRemoveSub = this.service.deleteAtivoAssinado(items)
    .subscribe(() => {
      this.poNotification.success('Ativos apagados em lote com sucesso.');
  
      selectedrows.forEach(row => {
        this.rows.splice(this.rows.indexOf(row), 1);
      });
    });
  }

  private onExport() {
    this.exportSub = this.service.exportCSVAssinatura(this.searchFilters);
  }
  
  uploadSuccess(event) {
    this.loadingAssLote = false;
    if(event.status == 200){
      this.poNotification.success('Assinatura realizada com sucesso');
    }
    else {
      this.poNotification.error('Erro em assinatura via CSV');
    }
  }

  clickTemplate(){
    this.service.downloadCSV();
  }

  triggerLoadingOv(){
    this.loadingAssLote = true;
  }

  notifyError(){
    this.loadingAssLote = false;
    this.poNotification.error('Erro em assinatura via CSV');
  }
  
}
