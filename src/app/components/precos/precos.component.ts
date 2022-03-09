import { Component, OnInit, ViewChild } from '@angular/core';
import {
  PoPageDynamicTableComponent,
  PoPageDynamicTableCustomAction,
} from '@po-ui/ng-templates';
import { BPOService } from '../../services/bpo.service';
import { PoNotificationService } from '@po-ui/ng-components';
import { MsalService } from '@azure/msal-angular';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-precos',
  templateUrl: './precos.component.html',
  styleUrls: ['./precos.component.css'],
  providers: [BPOService, PoNotificationService]
})
export class PrecosComponent implements OnInit {

  urlTabela: string;
  loadingRelatorio : boolean  = false;
  filtersPreco: any;

  @ViewChild('precosDynTable') precosDynTable : PoPageDynamicTableComponent
  private roles : any;

  constructor(private service: BPOService,
     private authService: MsalService,
     private poNotification: PoNotificationService) {
      this.roles = (this.authService.getAccount().idToken as any).roles;
   }

  ngOnInit(): void {
    this.urlTabela = this.service.getRelatorioPreco();
    this.defineTiposPapel();
  }

  pageCustomActions: Array<PoPageDynamicTableCustomAction> = [
    { label: 'Carregar Base Luz', action: this.requerirRelatorio.bind(this) },
    { label: 'Carregar Pu de Eventos', action: this.requerirRelatorioPuDeEventos.bind(this) },
    { label: 'Preços de hoje (CSV)', action: this.exportCSVDia.bind(this) },
    { label: 'Exportar tabela (CSV)', action: this.exportCSVTabela.bind(this) },
  ];

  readonly tipoOptions: Array<object> = [];

  readonly fields: Array<any> = [
    { property: 'codigoSNA', label: 'Código Ativo',gridColumns: 6, filter: true},
    { property: 'tipo', label: 'Tipo',filter: true, duplicate: true, options: this.tipoOptions,gridColumns: 6},
    { property: 'indexador', label: 'Indexador'},
    { property: 'taxaPos', label: 'Taxa Pós', type: 'number'},
    { property: 'taxaPre', label: 'Taxa Pré', type: 'number'},    
    { property: 'dataCriacaoInicio', visible: false, gridColumns: 6, label: 'Data de Recebimento - Início', type: 'dateTime', filter: true},
    { property: 'horaCriacaoInicio', visible: false, gridColumns: 4, label: 'Hora de Recebimento - Início', type: 'time', filter: true},
    { property: 'dataCriacaoFim', visible: false, gridColumns: 6, label: 'Data de Recebimento - Fim', type: 'dateTime', filter: true},
    { property: 'horaCriacaoFim', visible: false, gridColumns: 4, label: 'Hora de Recebimento - Fim', type: 'time', filter: true},
    { property: 'dataEvento', label: 'Data do Evento', type: 'date', gridColumns: 4, filter: true},
    { property: 'valorNominalBase', label: 'Valor Nominal Base', type: 'number'},
    { property: 'valorNominalAtualizado', label: 'Valor Nominal Atualizado', type: 'number'},
    { property: 'fatorCorrecao', label: 'Fator de Correção', type: 'number'},
    { property: 'fatorJuros', label: 'Fator Juros', type: 'number'},
    { property: 'puAbertura', label: 'P.U Abertura', type: 'number'},
    { property: 'pagamentos', label: 'Pagamentos', type: 'number'},
    { property: 'puFechamento', label: 'P.U Fechamemto', type: 'number'},
    { property: 'principal', label: 'Principal', type: 'number'},
    { property: 'inflacao', label: 'Inflação', type: 'number'},
    { property: 'juros', label: 'Juros', type: 'number'},
    { property: 'incorporado', label: 'Incorporado', type: 'number'},
    { property: 'incorporar', label: 'Incorporar', type: 'number'},
    { property: 'pagamentoJuros', label: 'Pgto Juros', type: 'number'},
    { property: 'pagamentoAmortizacao', label: 'Pgto Amortização', type: 'number'},
    { property: 'pagamentoAmex', label: 'Pgto Amex', type: 'number'},
    { property: 'pagamentoVencimento', label: 'Pgto Vencimento', type: 'number'},
    { property: 'pagamentoPremio', label: 'Pgto Premio', type: 'number'},
    { property: 'porcentualAmortizado', label: '% Amortizado', type: 'number'},
    { property: 'porcentualJurosIncorporado', label: '% Juros Incorporado', type: 'number'},
    { property: 'statusPgto', label: 'Status Pgto'},
    { property: 'dataAttStatusPgto',label: 'Data Atualização - Status Pgto', type: 'dateTime'},
  ];

  defineTiposPapel(){
    this.service.getPapelTypes().subscribe(
      (response) => {
        response.forEach(element => {
          var newOpt = {value:'', label: ''};
          newOpt.value = element;
          newOpt.label = element;
          this.tipoOptions.push(newOpt);
        });
        this.precosDynTable.fields = this.fields;
      });

  }

  requerirRelatorio(){
    if(this.roles == "reader") {
      this.poNotification.error("Usuário não autorizado");
    }
    else{
      this.loadingRelatorio = true;
      this.service.getRelatorioDiaPreco().subscribe(() => {this.loadingRelatorio = false;this.poNotification.success("Rodou relatório!");setTimeout(()=> window.location.reload(), 2000); }, error =>{this.loadingRelatorio = false;this.poNotification.error("Não Rodou relatório!");setTimeout(()=> window.location.reload(), 2000);} );
    }
  }

  requerirRelatorioPuDeEventos() {
    if (this.roles == "reader") {
      this.poNotification.error("Usuário não autorizado");
    }
    else {
      this.loadingRelatorio = true;
      this.service.getRelatorioPuDeEventos().subscribe(() => { this.loadingRelatorio = false; this.poNotification.success("Rodou relatório!"); setTimeout(() => window.location.reload(), 2000); }, error => { this.poNotification.error("Não Rodou relatório!") });
    }
  }

  exportCSVDia(){
    this.service.exportCSVPreco({dia: true});
  }
  exportCSVTabela(){
    this.service.exportCSVPreco();    
  }

}
