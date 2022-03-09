import { Component, OnInit, ViewChild } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { PoNotificationService, PoPageAction } from '@po-ui/ng-components';
import { PoPageDynamicSearchFilters, PoPageDynamicSearchLiterals } from '@po-ui/ng-templates';
import { BPOService } from '../../services/bpo.service';
import { DetalhePapelComponent } from '../detalhe-papel/detalhe-papel.component'

@Component({
  templateUrl: './busca-ativo.component.html',
  styleUrls: ['./busca-ativo.component.css']})

export class BuscaAtivoComponent implements OnInit {
  
  @ViewChild('detalheComp') detalheComp: DetalhePapelComponent
  
  hasSearch: boolean = false;
  isUnitRunning: boolean = false;
  role: any;
  filter : any = null;
  
  public readonly filters: Array<PoPageDynamicSearchFilters> = [
    { property: 'papel' ,label: 'Código Ativo', gridColumns: 6 }
  ];
  readonly literals: PoPageDynamicSearchLiterals = {
    disclaimerGroupTitle: 'Filtros aplicados:',
    filterTitle: 'Filtro de Ativos',
    filterCancelLabel: 'Fechar',
    filterConfirmLabel: 'Aplicar',
    quickSearchLabel: 'Código Ativo:',
    searchPlaceholder: 'Pesquise aqui'
  };

  public actions: Array<PoPageAction> = [];

  constructor(private authService: MsalService,
              private service: BPOService,
              private poNotification: PoNotificationService) { 
    this.role = (this.authService.getAccount().idToken as any).roles;
  }
    
  ngOnInit(): void {
    this.actions.push({ label: 'Cadastro Unitario BPO-MDP', action: this.cadastroUnitario.bind(this), disabled: true });
    this.actions.push({ label: 'Preço Histórico', action: this.precoHistoricoUnitario.bind(this), disabled: true });
    this.actions.push({ label: 'PU de Eventos', action: this.puDeEventosUnitario.bind(this), disabled: true });
  }
  onChangeDisclaimers(disclaimers) {
    const filter = {};
    disclaimers.forEach(item => {
      filter[item.property] = item.value;
    });
    if(disclaimers.length == 0) {
      this.hasSearch = false;
      this.detalheComp.hasCad = false;
      this.detalheComp.hasDet = false;
      this.detalheComp.hasLog = false;
      this.detalheComp.hasPreco = false;
      this.detalheComp.hasFluxo = false;
      this.detalheComp.hasFilter = false;
      this.filter = null;
      this.resetButton();
    }
  }
  
  onQuickSearch(filter) {
    this.hasSearch = true;
    this.detalheComp.loadData(filter);
    this.resetButton();
    this.filter = filter;
  }
  
  onAdvancedSearch(filter) {
    this.hasSearch = true;
    this.detalheComp.loadData(filter.papel);
    this.resetButton();
    this.filter = filter;
  }

  cadastroUnitario(){
    this.isUnitRunning = true;
    this.service.getCadastroUnitario(this.filter).subscribe((response) => {
      if(response == null)
      {
        this.poNotification.error('Erro no cadastro unitário');
        this.isUnitRunning = false;
      }
      else {
        response.forEach(element => {
          if(element.message!=null){
            this.poNotification.warning(element.message);
          }
          this.isUnitRunning = false;
        });
      }
      
    },
    error => {
      this.poNotification.error('Erro no cadastro unitário');
      this.isUnitRunning = false;
    });      
  }

  precoHistoricoUnitario() {
    this.isUnitRunning = true;
    this.service.getPrecoHistoricoUnitario(this.filter).subscribe((response) => {
      if (response == null) {
        this.poNotification.error('Erro no carregamento do preço historico');
        this.isUnitRunning = false;
      }
      else {
        response.forEach(element => {
          if (element.message != null) {
            this.poNotification.warning(element.message);
          }
          this.isUnitRunning = false;
        });
      }

    },
      error => {
        this.poNotification.error('Erro no carregamento do preço historico');
        this.isUnitRunning = false;
      });
  }

  puDeEventosUnitario() {
    this.isUnitRunning = true;
    this.service.getPuDeEventosUnitario(this.filter).subscribe((response) => {
      if (response == null) {
        this.poNotification.error('Erro no carregamento do pu de eventos');
        this.isUnitRunning = false;
      }
      else {
        this.isUnitRunning = false;
        this.poNotification.success("Pu de evento atualizado.");
      }

    },
      error => {
        this.poNotification.error(error.error.detail);
        this.isUnitRunning = false;
      });
  }

  resetButton(){
    this.actions = [];
    this.actions.push({ label: 'Cadastro Unitario BPO-MDP', action: this.cadastroUnitario.bind(this), disabled: !this.hasSearch });
    this.actions.push({ label: 'Preço Histórico', action: this.precoHistoricoUnitario.bind(this), disabled: !this.hasSearch });
    this.actions.push({ label: 'PU de Eventos', action: this.puDeEventosUnitario.bind(this), disabled: !this.hasSearch });
  }
}
