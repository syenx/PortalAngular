import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { PoNotificationService, PoPageDetailLiterals, PoPageAction } from '@po-ui/ng-components';
import { BPOService } from '../../services/bpo.service';
import { DetalhePapelComponent } from '../detalhe-papel/detalhe-papel.component';

@Component({
  templateUrl: './page-detail.component.html',
  styleUrls: ['./page-detail.component.css']
})
export class PageDetailComponent implements OnInit {

  @ViewChild('detalheComp') detalheComp: DetalhePapelComponent

  isUnitRunning: boolean = false;

  public readonly actions: Array<PoPageAction> = [
    { label: 'Cadastro Unitario BPO-MDP', action: this.cadastroUnitario.bind(this), icon: 'po-icon-edit' },
    { label: 'Back', action: this.back.bind(this) },
    { label: 'Preço Histórico', action: this.precoHistoricoUnitario.bind(this) },
    { label: 'PU de Eventos', action: this.puDeEventosUnitario.bind(this) }
  ];

  papel: string;
  title: string = "Detalhes do Ativo: "
  role: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: MsalService,
    private service: BPOService,
    private poNotification: PoNotificationService) { 
      this.role = (this.authService.getAccount().idToken as any).roles;
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.papel = params.papel);
    this.title = this.title + this.papel;
    //this.detalheComp.loadData(this.papel);
  }

  ngAfterViewInit() {
    this.detalheComp.loadData(this.papel);
  }

  back() {
    this.router.navigateByUrl('/ativos');
  }

  cadastroUnitario() {
    if (this.role == "reader") {
      this.poNotification.error("Usuário não autorizado");
    }
    else {
      this.isUnitRunning = true;
      this.service.getCadastroUnitario(this.papel).subscribe((response) => {
        if (response == null) {
          this.poNotification.error('Erro no cadastro unitário');
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
          this.poNotification.error('Erro no cadastro unitário');
          this.isUnitRunning = false;
        })
    }
  }

  precoHistoricoUnitario() {
    if (this.role == "reader") {
      this.poNotification.error("Usuário não autorizado");
    }
    else {
      this.isUnitRunning = true;
      this.service.getPrecoHistoricoUnitario(this.papel).subscribe((response) => {
        if (response == null) {
          this.poNotification.error('Erro no carregamento do preço historico');
          this.isUnitRunning = false;
        }
        else {
          this.isUnitRunning = false;
          this.poNotification.success("Preço histórico atualizado.");
        }

      },
        error => {
          this.poNotification.error('Erro no carregamento do preço historico');
          this.isUnitRunning = false;
        });
    }
  }

  puDeEventosUnitario() {
    if (this.role == "reader") {
      this.poNotification.error("Usuário não autorizado");
    }
    else {
      this.isUnitRunning = true;
      this.service.getPuDeEventosUnitario(this.papel).subscribe((response) => {
        if (response == null) {
          this.poNotification.error('Erro no carregamento do pu de eventos');
          this.isUnitRunning = false;
        }
        else {
          this.isUnitRunning = false;
          this.poNotification.success("Pu de evento atualizado.");
        }

      },
        error  => {
          this.poNotification.error(error.error.detail);
          this.isUnitRunning = false;
        });
    }
  }

}
