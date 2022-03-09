import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoAccordionComponent, PoDisclaimer, PoDynamicFormField, PoDynamicViewField, PoNotificationService, PoTableAction, PoTableColumn, PoTableComponent} from '@po-ui/ng-components';
import { PoPageDynamicSearchFilters, PoPageDynamicSearchLiterals } from '@po-ui/ng-templates';
import { Subscription } from 'rxjs';
import { BPOService } from '../../services/bpo.service';
import { ResumoAssinaturaComponent } from './resumo-assinatura/resumo-assinatura.component';

interface CadastroresponseTypes {
  codigoSNA: string,
  tipo: string,
  isin: string,
  emissor: string,
  cnpjEmissor: string,
  dataEmissao: string,
  dataInicioRentabilidade: string,
  dataVencimento: string,
  valorNominalEmissao: number,
  instrucaoCVM: string,
  clearing: string,
  agenteFiduciario: string,
  possibilidadeResgateAntecipado: boolean,
  conversivelAcao: boolean,
  debentureIncentivada: boolean,
  criterioCalculoIndexador: string,
  criterioCalculoJuros: string,
  indexador: string,
  taxaPre: number,
  taxaPos: number,
  projecao: string,
  amortizacao: string,
  periodicidadeCorrecao: string,
  unidadeIndexador: string,
  defasagemIndexador: number,
  diaReferenciaIndexador: number,
  mesReferenciaIndexador: number,
  devedor: string,
  tipoRegime: string,
  tipoAniversario: string,
  consideraCorrecaoNegativa: boolean,
  dataUltimaAlteracao: string,
  cnpjDevedor: string,
  cnpjAgenteFiduciario: string,
}


@Component({
  selector: 'app-detalhe-papel',
  templateUrl: './detalhe-papel.component.html',
  styleUrls: ['./detalhe-papel.component.css'],
  providers: [PoNotificationService, BPOService]
})

export class DetalhePapelComponent implements OnInit {
  
  @ViewChild('detailAccordion') detailAccordion: ResumoAssinaturaComponent;
  @ViewChild('cadastroAccordion') cadastroAccordion: PoAccordionComponent;
  @ViewChild('logAccordion') logAccordion: PoAccordionComponent;
  @ViewChild('precoAccordion') precoAccordion: PoAccordionComponent;
  @ViewChild('fluxoAccordion') fluxoAccordion: PoAccordionComponent;
  @ViewChild('precotable') precotable: PoTableComponent;

  @Output() eventSearchDet = new EventEmitter<boolean>();

  filtersDisc: Array<PoDisclaimer> = [];

  formPrecoFilter : FormGroup;
  lastAtt : {date: string,time: string} = {date: '',time: ''};
  paramsDefPrecoFilter: any;
  pagePreco: number = 1;
  pageFluxo: number = 1;
  papel: string = "";
  hasNextPreco: boolean = false;
  hasNextFluxo: boolean = false;
  
  cadastroDefault : CadastroresponseTypes;
  cadastro : CadastroresponseTypes;

  logsData : Array<any> = [];
  precoData : Array<any> = [];
  fluxoData : Array<any> = [];

  @Input() hasSearch: boolean;
  @Input() role: string = "reader";
  
  @Output() hasDet: boolean = false;
  @Output() hasCad: boolean = false;
  @Output() hasLog: boolean = false;
  @Output() hasPreco: boolean = false;
  @Output() hasFluxo: boolean = false;
  @Output() hasFilter: boolean = false;

  loadingLog: boolean;
  loadingPreco: boolean = false;
  loadingFluxo: boolean = false;
   
  cadastroSub: Subscription;
  logSub: Subscription;
  precoSub: Subscription;
  fluxoSub: Subscription;
  
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
  
    
  cadastrofields: Array<PoDynamicViewField> = [
    { property: 'codigoSNA', label: 'SNA', divider: 'Dados do Ativo' , gridColumns: 4, order: 1 },
    { property: 'tipo', label: 'Tipo', gridColumns: 4, order: 2},
    { property: 'isin', label: 'ISIN', gridColumns: 4, order: 3},
    
    { property: 'emissor', label: 'Emissor',divider: 'Dados da Emissão', gridColumns: 4, order: 4},
    { property: 'cnpjEmissor', label: 'CNPJ Emissor', gridColumns: 4, order: 5},
    { property: 'dataEmissao', label: 'Data de Emissão', type: 'date', gridColumns: 4, order: 6},
    { property: 'dataInicioRentabilidade', label: 'Data do Início de Rentabilidade', type: 'date', gridColumns: 4, order: 7},
    { property: 'dataVencimento', label: 'Data de Vencimento', type: 'date', gridColumns: 4, order: 8},
    { property: 'valorNominalEmissao', label: 'Valor Nominal da Emissão', type: 'currency', format: 'BRL', gridColumns: 4, order: 9},
    { property: 'instrucaoCVM', label: 'Instrução CVM', gridColumns: 4, order: 10},
    { property: 'clearing', label: 'Clearing', gridColumns: 4, order: 11},
    { property: 'agenteFiduciario', label: 'Agente Fiduciário', gridColumns: 4, order: 12 },
    { property: 'cnpjAgenteFiduciario', label: 'CNPJ Agente Fiduciário', gridColumns: 4, order: 13 },
    { property: 'cnpjDevedor', label: 'CNPJ Devedor', gridColumns: 4, order: 14 },
    
    { property: 'possibilidadeResgateAntecipado', divider: 'Flags', label: 'Resgate Antecipado ?',type: 'boolean', tag: true, gridColumns: 3, order: 15},
    { property: 'conversivelAcao', label: 'Ação Conversível ?',type: 'boolean', tag: true, gridColumns: 3, order: 16},
    { property: 'debentureIncentivada', label: 'Debenture Incentivada ?',type: 'boolean', tag: true, gridColumns: 3, order: 17},
    { property: 'consideraCorrecaoNegativa', label: 'Considera correção negativa ?',type: 'boolean', tag: true, gridColumns: 3, order: 18},
    
    { property: 'criterioCalculoIndexador', divider: 'Critérios e taxas', label: 'Critério Indexador', gridColumns: 4, order: 19 },
    { property: 'criterioCalculoJuros', label: 'Critério Juros', gridColumns: 4, order: 20 },
    { property: 'indexador', label: 'Indexador', gridColumns: 4, order: 21 },
    { property: 'taxaPre', label: 'Taxa Pré', type: 'number', gridColumns: 4, order: 22},
    { property: 'taxaPos', label: 'Taxa Pós', type: 'number', gridColumns: 4, order: 23},
    { property: 'projecao', label: 'Projeção', gridColumns: 4, order: 24 },
    { property: 'amortizacao', label: 'Tipo Amortização', gridColumns: 4, order: 25 },
    { property: 'periodicidadeCorrecao', label: 'Periodicidade da Correção', gridColumns: 4, order: 26 },
    
    { property: 'unidadeIndexador', divider: 'Dados do Indexador', label: 'Unidade do Indexador', gridColumns: 3, order: 27 },
    { property: 'defasagemIndexador', label: 'Defasagem do Indexador', type: 'number', gridColumns: 3, order: 28},
    { property: 'diaReferenciaIndexador', label: 'Dia referência do Indexador', type: 'number', gridColumns: 3, order: 29},
    { property: 'mesReferenciaIndexador', label: 'Mês referência do Indexador', type: 'number', gridColumns: 3, order: 30},
    
    { property: 'devedor', divider:'Outros', label: 'Devedor', gridColumns: 3, order: 31 },
    { property: 'tipoRegime', label: 'Tipo Regime', gridColumns: 3, order: 32 },
    { property: 'tipoAniversario', label: 'Tipo Aniversário', gridColumns: 3, order: 33 },
    { property: 'dataUltimaAlteracao', label: 'Data da última alteração', type: 'dateTime', gridColumns: 3, order: 34}
    
  ];
  
  logtableActions: Array<PoTableAction> = [
    // { action: this.onViewRow.bind(this), label: 'Visualizar' },
    //{ action: this.logDetail.bind(this), label: 'Detalhes', icon: 'po-icon-info' },
    // { action: this.onRemoveRow.bind(this), label: 'Remover', type: 'danger',icon: 'po-icon-delete', separator: true }
  ];
  
  logtableColumns: Array<PoTableColumn> = [
    { property: 'papel', label: 'Código Ativo' },
    { property: 'dataAtualizacao', label: 'Data de Atualização', type: 'dateTime'},
    { property: 'usuario', label: 'Autor' },
    { property: 'assinado', type: 'label', label: 'Status Assinatura', labels:[
      { value: 'Sim', color: 'color-10', label: 'Assinado' },
      { value: 'Não', color: 'color-07', label: 'Não-Assinado' }
    ]},
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
    ]},
  ];

  precotableColumns: Array<PoTableColumn> = [
    { property: 'codigoSNA', label: 'Código Ativo', width: '11%' },
    { property: 'tipo', label: 'Tipo', width: '8%' },
    { property: 'dataEvento', label: 'Data Evento', type: 'date', width: '10%'},
    { property: 'valorNominalBase', label: 'Nominal Base', type: 'number', width: '13%'},
    { property: 'valorNominalAtualizado', label: 'Nominal Atualizado', type: 'number', width: '15%'},
    { property: 'fatorCorrecao', label: 'Fator Correção', type: 'number', width: '13%'},
    { property: 'fatorJuros', label: 'Fator Juros', type: 'number', width: '9%'},
    { property: 'puAbertura', label: 'P.U Abertura', type: 'number', width: '10%'},
    { property: 'puFechamento', label: 'P.U Fechamento', type: 'number', width: '11%'},
  ];

  fluxotableColumns: Array<PoTableColumn> = [
    { property: 'codigoSNA', label: 'Código Ativo' },
    { property: 'dataBase', label: 'Data Base', type: 'dateTime'},
    { property: 'dataLiquidacao', label: 'Data de Liquidação', type: 'dateTime'},
    { property: 'tipoEvento', label: 'Tipo de Evento' },
    { property: 'taxa', label: 'Taxa', type: 'number'},
 ];
  
  constructor(
    private formBuilder: FormBuilder,
    private service: BPOService,
    private poNotification: PoNotificationService) {
    }
    
  ngOnInit(): void {
    this.formPrecoFilter = this.formBuilder.group({
      dateEnd: [new Date(), Validators.required],
      dateStart: [new Date(), Validators.required],
      timeEndSTR: ['', Validators.required],
      timeStartSTR: ['', Validators.required],
    });
  
  }

  handleError(message: string) {
    this.poNotification.error(message);
  }
  reloadhasFlags() {
    this.hasCad = false;
    this.hasLog = false;
    this.hasDet = false;
    this.hasPreco = false;
    this.hasFluxo = false;
    this.pagePreco = 1;
    this.pageFluxo = 1;
  }
  
  loadData(papel) {
    this.reloadhasFlags();
    this.papel = papel;

    this.loadFluxo(papel);

    this.loadDetalhes(papel);
    
    this.loadingLog = true;
    
    this.loadCadastro(papel);
    
    this.loadLog(papel);

    this.getLastAttPreco(papel);

    setTimeout(() => {
      if(!(this.hasCad || this.hasLog || this.hasPreco || this.hasFluxo)) {
        this.hasSearch = false;
        this.papel = "";
      }     
    },10000);

  }

  loadDetalhes(papel) {
    this.service.getPapelInfo(papel? papel : 'error')
    .subscribe(
      (response: {papel: string, dataAssinatura: string, impactaCadastro?: string, impactaPreco?: string, impactaEvento?: string, impactaHistorico?: string, assinado: string }) => {
        this.hasDet = true;
        this.detailAccordion.loadData(response);       
      },
      error => {
        this.hasDet = false; 
      } );
  }
      
  loadCadastro(papel) {
    this.cadastroSub = this.service.getCadastro(papel)
    .subscribe(
      (cadastroresponseTypes) => {
        this.cadastroDefault = this.initCadastro();
        this.cadastro = Object.assign(this.cadastroDefault,cadastroresponseTypes);
        this.hasCad = true;
        
      },
      error => {
        //this.handleError("Não foi possível encontrar o cadastro do Ativo procurado");
        this.hasCad = false;
      });
  }

  loadLog(papel) {
    this.logSub = this.service.getLogInfo({papel: papel})
    .subscribe( (response: {items: Array<any>}) => {
      this.logsData = response.items;
      this.logsData.forEach(element => {
        element.impactaCadastro = element.estado.impactaCadastro;
        element.impactaPreco = element.estado.impactaPreco;
        element.impactaEvento = element.estado.impactaEvento;
        element.impactaHistorico = element.estado.impactaHistorico;
        element.assinado = element.estado.assinado;
      });
      this.loadingLog = false;
      this.hasLog = true;
    },
    error => {
      //this.handleError("Não foi possível encontrar o histórico do Ativo procurado");
      this.hasLog = false;
    });
  }

  loadPreco(papel,params:{page?: number,dateStart?: string,dateEnd?:string, timeStartSTR?:string, timeEndSTR?:string}= {}) {
    this.loadingPreco = true;
    this.precoSub = this.service.getPrecoInfo(papel,params)
    .subscribe( (response: {items: Array<any>, hasNext: boolean}) => {
      this.precoData = !params.page || params.page === 1
      ? response.items
      : [...this.precoData, ...response.items];
      this.hasNextPreco = response.hasNext;
      this.hasPreco = true;
      this.loadingPreco = false;
    },
    error => {
      this.hasPreco = false;
      this.pagePreco = 1;
    });
  }
  loadFluxo(papel,params:{page?: number} = {}) {
    this.loadingFluxo = true;
    this.fluxoSub = this.service.getFluxoInfo(papel,params)
    .subscribe( (response: {items: Array<any>, hasNext: boolean}) => {
      this.fluxoData = !params.page || params.page === 1
      ? response.items
      : [...this.fluxoData, ...response.items];
      this.hasNextFluxo = response.hasNext;
      this.hasFluxo = true;
      this.loadingFluxo = false;
    },
    error => {
      this.hasFluxo = false;
      this.pageFluxo = 1;
    });
  }

  showMorePreco(event) {
    let params: any = {
      page: ++this.pagePreco,
    };
    if(!this.hasFilter) {
      this.formPrecoFilter.reset(this.paramsDefPrecoFilter);
    }
    params = { ...params,...this.formPrecoFilter.getRawValue()};
    this.loadPreco(this.papel,params);
  }
  showMoreFluxo(event) {
    let params: any = {
      page: ++this.pageFluxo,
    };
    
    this.loadFluxo(this.papel,params);
  }

  getLastAttPreco(papel){
    this.service.getLastAttPreco({papel: papel}).subscribe((response) => {
      var formatResp = formatDate(response,'yyyy-MM-dd HH:mm','pt','-0300');
      var splitFormat = formatResp.split(' ');
      this.lastAtt.date = splitFormat[0];
      this.lastAtt.time = splitFormat[1]; 
      this.loadPreco(papel, {dateStart: this.lastAtt.date});
      this.paramsDefPrecoFilter = {
        dateEnd: this.lastAtt.date,
        dateStart: this.lastAtt.date,
        timeStartSTR: '0000',
        timeEndSTR: '2359',
      };
      this.formPrecoFilter.reset(this.paramsDefPrecoFilter);
    });
  }

  precoDateFilter() {
    this.loadPreco(this.papel,this.formPrecoFilter.getRawValue());
    this.hasFilter = true;
    this.pagePreco = 1;
    this.showFilters(this.formPrecoFilter.getRawValue());
  }

  showFilters(filters: any) {
    this.filtersDisc = [];
    Object.keys(filters).forEach(key => {
      var filter = {property: '', value: '', label: '', hideClose: true};
      filter.property = key;
      filter.value = filters[key];
      filter.label = `${filter.property.charAt(0).toUpperCase() + filter.property.slice(1)}: ${filter.value}`;
      this.filtersDisc.push(filter);
    });    
  }

  precoFilteredExport() {
    var params = {papel: this.papel};

    if(this.hasFilter)
    {
      params = {...params,...this.formPrecoFilter.getRawValue()};
    }
    else {
      params = {...params,...this.paramsDefPrecoFilter};
      this.formPrecoFilter.reset(this.paramsDefPrecoFilter);
    }
    this.service.exportCSVPrecoHist(params);
  }

  loadlogEventResp(event) {
    this.loadingLog = event;
    setTimeout(() => {
      this.loadLog(this.papel);      
    },2000);
  }

        
  initCadastro() {
    var cadastroDefault : CadastroresponseTypes = {
      
      codigoSNA : "-",
      tipo: "-",
      isin: "-",
      emissor: "-",
      cnpjEmissor: "-",
      dataEmissao: "-",
      dataInicioRentabilidade: "-",
      dataVencimento: "-",
      possibilidadeResgateAntecipado:  false,
      conversivelAcao: false,
      debentureIncentivada: false,
      criterioCalculoIndexador: "-",
      criterioCalculoJuros: "-",
      indexador: "-",
      projecao: "-",
      amortizacao: "-",
      periodicidadeCorrecao: "-",
      unidadeIndexador: "-",
      devedor: "-",
      tipoRegime: "-",
      tipoAniversario: "-",
      consideraCorrecaoNegativa: false,
      valorNominalEmissao : null,
      instrucaoCVM: "-",
      clearing: "-",
      agenteFiduciario: "-",
      taxaPre : null,
      taxaPos : null,
      defasagemIndexador : null,
      diaReferenciaIndexador : null,
      mesReferenciaIndexador : null,
      dataUltimaAlteracao: "-",
      cnpjDevedor: "-",
      cnpjAgenteFiduciario: "-",
    };
    
    
    return cadastroDefault;
  }
}
