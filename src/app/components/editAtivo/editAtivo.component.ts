import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { PoNotificationService, PoSelectOption } from '@po-ui/ng-components';

import { BPOService } from '../../services/bpo.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-editAtivo',
  templateUrl: './editAtivo.component.html',
  styleUrls: ['./editAtivo.component.css'],
  providers: [BPOService]
})
export class EditAtivoComponent implements OnInit, OnDestroy {

  private rowSub: Subscription;

  fields = [
    { property: 'papel', label: 'Código Ativo', divider: 'Informações necessárias', required: true, gridColumns: 12,
      help: "Exemplo: CGMG18"
    },
    { property: 'impactaCadastro', type: 'boolean', label: 'Cadastro', required: true, 
    gridColumns: 5, 
    booleanFalse: 'Não',
    booleanTrue: 'Sim',
    help: "Se selecionado, significa que os cadastros vindos da Luz serão enviados para o Market Data Portal"},
    { property: 'impactaPreco', type: 'boolean', label: 'Preço do dia', required: true, 
    gridColumns: 5, 
    booleanFalse: 'Não',
    booleanTrue: 'Sim',
    help: "Se selecionado, significa que os preços do dia vindos da Luz serão enviados para o Market Data Portal"},
    { property: 'impactaEvento', type: 'boolean', label: 'PU Eventos', required: true, 
    gridColumns: 5, 
    booleanFalse: 'Não',
    booleanTrue: 'Sim',
    help: "Se selecionado, significa que os PU's de evento vindos da Luz serão enviados para o Market Data Portal"},
    { property: 'impactaHistorico', type: 'boolean', label: 'Preço Histórico', required: true, 
    gridColumns: 5, 
    booleanFalse: 'Não',
    booleanTrue: 'Sim',
    help: "Se selecionado, significa que os preços históricos vindos da Luz serão enviados para o Market Data Portal"},
  ];

  public row: any = {};
  public state: string = '';

  constructor(
    private poNotification: PoNotificationService,
    private router: Router,
    private service: BPOService) {}

  ngOnDestroy() {
    if (this.rowSub) {
      this.rowSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.row = {
      impactaCadastro: true,
      impactaPreco: true,
      impactaEvento: true,
      impactaHistorico: true
    }
  }
  cancel() {
    this.router.navigateByUrl('/ativos');
  }

  save() {
    const row = { 'items': [] };
    row.items = [this.row];
    this.rowSub = this.service.assinatura(row)
      .subscribe(() => {
        this.navigateToList('Ativo cadastrado com sucesso');
      },
        error => {
          this.poNotification.error("Não foi possível atualizar o Ativo")
          this.router.navigateByUrl('/ativos');
        });
  }

  private navigateToList(msg: string) {
    this.poNotification.success(msg);

    this.router.navigateByUrl('/ativos');
  }

}
