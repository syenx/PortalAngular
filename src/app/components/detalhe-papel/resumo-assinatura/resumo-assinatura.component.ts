import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PoDynamicFormField, PoNotificationService } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { BPOService } from '../../../services/bpo.service';

@Component({
  selector: 'app-resumo-assinatura',
  templateUrl: './resumo-assinatura.component.html',
  styleUrls: ['./resumo-assinatura.component.css']
})
export class ResumoAssinaturaComponent implements OnInit,OnDestroy {

  @Input() role: string = "reader";
  @Output() loadLogEvent : EventEmitter<boolean> = new EventEmitter();
  @Output() handleErrorEvent : EventEmitter<string> = new EventEmitter();

  detailativo : any;

  removeAssSub: Subscription;
  AssSub: Subscription;
  detalhesSub: Subscription;

  statusIniCadastro: boolean;
  statusIniPreco: boolean;
  statusIniPUEvento: boolean;
  statusIniPrecoHist: boolean;
  statusIniAssinatura: boolean;

  switches : Array<PoDynamicFormField> = [];
  switches2 : Array<PoDynamicFormField> = [];

  constructor(private service: BPOService,
    private poNotification: PoNotificationService) { }
  
  ngOnInit(): void {
    this.switches = [];
    this.switches2 = [];
    this.switches.push({ property: 'impactaCadastro', type: 'boolean', label: 'Cadastro', required: true,gridColumns: 3, booleanFalse: 'Não', booleanTrue: 'Sim', disabled:  this.role == "reader"});
    this.switches.push({ property: 'impactaPreco', type: 'boolean', label: 'Preço do dia', required: true,gridColumns: 3, booleanFalse: 'Não', booleanTrue: 'Sim', disabled:  this.role == "reader"});
    this.switches.push({ property: 'impactaEvento', type: 'boolean', label: 'PU Eventos', required: true,gridColumns: 3, booleanFalse: 'Não', booleanTrue: 'Sim', disabled:  this.role == "reader"});
    this.switches.push({ property: 'impactaHistorico', type: 'boolean', label: 'Preço Histórico', required: true,gridColumns: 3, booleanFalse: 'Não', booleanTrue: 'Sim', disabled:  this.role == "reader"});
    this.switches2.push({ property: 'assinado', type: 'boolean', label: 'Ativo Assinado?', required: true,gridColumns: 4, booleanFalse: 'Não', booleanTrue: 'Sim', disabled:  this.role == "reader"});
  }

  ngOnDestroy(): void {
    if (this.removeAssSub) {
      this.removeAssSub.unsubscribe();
    }

    if (this.AssSub) {
      this.AssSub.unsubscribe();
    }

    if (this.detalhesSub) {
      this.detalhesSub.unsubscribe();
    }
  }


  attClick(){
    if(!this.detailativo.assinado) {
      this.detailativo.impactaCadastro = false;
      this.detailativo.impactaPreco = false;
      this.detailativo.impactaEvento = false;
      this.detailativo.impactaHistorico = false;

      const items: any = [{'papel' : this.detailativo.papel}];
      this.removeAssSub = this.service.deleteAtivoAssinado(items)
      .subscribe(() => {
        this.poNotification.success('Ativo apagado com sucesso.');
        this.statusIniCadastro = this.detailativo.impactaCadastro;
        this.statusIniPreco = this.detailativo.impactaPreco;
        this.statusIniPUEvento = this.detailativo.impactaEvento;
        this.statusIniPrecoHist = this.detailativo.impactaHistorico;
        this.statusIniAssinatura = this.detailativo.assinado;     
      },
      error => {
        this.handleErrorEvent.next("Não foi possível deletar o Ativo");
        this.cancelClick();
      });
    }
    else {
      var rowEditDelete: any = {"items": []};
      const rowJSON = {};
      rowJSON["papel"] = this.detailativo.papel;
      rowJSON["impactaCadastro"] = this.detailativo.impactaCadastro;
      rowJSON["impactaPreco"] = this.detailativo.impactaPreco;
      rowJSON["impactaEvento"] = this.detailativo.impactaEvento;
      rowJSON["impactaHistorico"] = this.detailativo.impactaHistorico;
      rowEditDelete.items = [rowJSON];

      this.AssSub = this.service.assinatura(rowEditDelete)
      .subscribe(() => {
        this.poNotification.success('Assinatura atualizada com sucesso.');
        this.statusIniCadastro = this.detailativo.impactaCadastro;
        this.statusIniPreco = this.detailativo.impactaPreco;
        this.statusIniPUEvento = this.detailativo.impactaEvento;
        this.statusIniPrecoHist = this.detailativo.impactaHistorico;
        this.statusIniAssinatura = this.detailativo.assinado;
      },
        error => {
          this.handleErrorEvent.next("Não foi possível atualizar o Ativo");
          this.cancelClick();
        });
    }
    var papel = this.detailativo.papel;
    this.loadLogEvent.next(true);
  }
    
  cancelClick(){
    this.detailativo.impactaCadastro = this.statusIniCadastro ;
    this.detailativo.impactaPreco = this.statusIniPreco ;
    this.detailativo.impactaEvento = this.statusIniPUEvento;
    this.detailativo.impactaHistorico = this.statusIniPrecoHist;
    this.detailativo.assinado = this.statusIniAssinatura;
  }

  loadData(response: {papel?: string, dataAssinatura?: string, impactaCadastro?: string, impactaPreco?: string, impactaEvento?: string, impactaHistorico?: string, assinado?: string } = {}){
    this.detailativo = response;

    this.statusIniCadastro = this.detailativo.impactaCadastro;
    this.statusIniPreco = this.detailativo.impactaPreco;
    this.statusIniPUEvento = this.detailativo.impactaEvento;
    this.statusIniPrecoHist = this.detailativo.impactaHistorico;
    this.statusIniAssinatura = this.detailativo.assinado;
  }
  
  activateAtt() {
    var impacta = this.detailativo?.impactaCadastro == true || this.detailativo?.impactaPreco == true || this.detailativo?.impactaEvento == true || this.detailativo?.impactaHistorico == true;
    var equalCadastro = this.statusIniCadastro == this.detailativo?.impactaCadastro;
    var equalPreco = this.statusIniPreco == this.detailativo?.impactaPreco;
    var equalPUEvento = this.statusIniPUEvento == this.detailativo?.impactaEvento;
    var equalPrecoHist = this.statusIniPrecoHist == this.detailativo?.impactaHistorico;
    var equalAssinatura = this.statusIniAssinatura == this.detailativo?.assinado;
    var equalImpacto = equalCadastro && equalPreco && equalPUEvento && equalPrecoHist;

    return (this.role == 'reader') || ((equalAssinatura && equalImpacto)||(impacta && this.statusIniAssinatura == false && this.detailativo?.assinado==false));
  }

}
