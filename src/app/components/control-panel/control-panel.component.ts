import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { PoDynamicFormField, PoModalAction, PoModalComponent, PoNotificationService, PoUploadComponent, PoUploadLiterals } from '@po-ui/ng-components';
import { BPOService } from '../../services/bpo.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {

  @ViewChild('modalDisaster') modalDisaster: PoModalComponent;
  @ViewChild('modalDisasterUnitario') modalDisasterUnitario: PoModalComponent;
  @ViewChild('relatorioConfirmation') relatorioConfirmation: PoModalComponent;
  // @ViewChild('disasterRecoveryButton', { read: ElementRef, static: true }) disasterRecoveryRef: ElementRef;
  @ViewChild('loteMod') loteMod: PoModalComponent;
  @ViewChild('UploadCSVComp') UploadCSVComp: PoUploadComponent;

  isExportRunning: boolean = false;

  role: any;
  tipoFlag: string = '';
  papelRecovery: string = '';

  formDisasterRecovery : FormGroup;
  formDisasterRecoveryUnitario : FormGroup;

  confirmRecovery: PoModalAction = {
    action: () => {
      this.disasterRecovery();
    },
    label: 'Confirmar'
  };
  cancelRecovery: PoModalAction = {
    action: () => {
      this.modalDisaster.close();
    },
    label: 'Cancelar'
  };

  confirmRecoveryUnitario: PoModalAction = {
    action: () => {
      this.disasterRecoveryUnitario();
    },
    label: 'Confirmar'
  };
  cancelRecoveryUnitario: PoModalAction = {
    action: () => {
      this.modalDisasterUnitario.close();
    },
    label: 'Cancelar'
  };

  confirmRelatorio: PoModalAction = {
    action: () => {
    },
    label: 'Confirmar'
  };
  cancelRelatorio: PoModalAction = {
    action: () => {
      this.relatorioConfirmation.close();
    },
    label: 'Cancelar'
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: MsalService, 
    private service: BPOService, 
    private poNotification: PoNotificationService) { 
    this.role = (this.authService.getAccount().idToken as any).roles;
  }
  public loadingCadastroLote: boolean = false;
  public sign_url_lote: string;
  public restrictions = { allowedExtensions: ['.csv'] };
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

  ngOnInit(): void {
    this.formDisasterRecovery = this.formBuilder.group({
      data: [new Date(), Validators.required]
    });

    this.formDisasterRecoveryUnitario = this.formBuilder.group({
      papel: ['', Validators.required],
      data: [new Date(), Validators.required]
    });
    this.sign_url_lote = this.service.cadastroLoteURL();
  }

  callrelatorioConfirmation(tipoFlag)
  {
    this.tipoFlag = tipoFlag;

    if(this.tipoFlag == "Cadastro")
    {
      this.confirmRelatorio.action = () => this.requerirRelatorioCadastro();
    }
    if(this.tipoFlag == "Pre??os Intraday")
    {
      this.confirmRelatorio.action = () => this.requerirRelatorioPreco();
    }
    if(this.tipoFlag == "PU Evento")
    {
      this.confirmRelatorio.action = () => this.requerirRelatorioPuDeEventos();
    }

    this.relatorioConfirmation.open();
  }

  exportCadastro() {
    this.isExportRunning = true;
    this.service.exportCSVCadastro().subscribe(data => {
      const dataURI = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
      const exportfileName = 'CadastrosLuz.csv';
      this.service.downloadCSV(dataURI, exportfileName);
      this.isExportRunning = false;
    },
      error => {
        this.poNotification.error("Problema ao exportar cadastros");
        this.isExportRunning = false;
      });
  }

  exportFluxo() {
    this.isExportRunning = true;
    this.service.exportCSVFluxo().subscribe(data => {
      const dataURI = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
      const exportfileName = 'FluxosLuz.csv';
      this.service.downloadCSV(dataURI, exportfileName);
      this.isExportRunning = false;
    },
      error => {
        this.poNotification.error("Problema ao exportar fluxos");
        this.isExportRunning = false;
      });
  }

  requerirRelatorioCadastro(){
    if(this.role == "reader") {
      this.poNotification.error("Usu??rio n??o autorizado");
    }
    else{
      this.isExportRunning = true;
      this.service.getRelatorioDiaCaracteristica().subscribe(() => {
        this.poNotification.success("Relat??rio de cadastros requerido com sucesso!");
        this.isExportRunning = false;
        //setTimeout(()=> window.location.reload(), 2000); 
      }, error =>{this.poNotification.error("Erro na demanda do relat??rio de cadastros");this.isExportRunning = false;} );
  
    }
    this.relatorioConfirmation.close();
  }

  requerirRelatorioPreco(){
    if(this.role == "reader") {
      this.poNotification.error("Usu??rio n??o autorizado");
    }
    else{
      this.isExportRunning = true;
      this.service.getRelatorioDiaPreco().subscribe(() => {this.isExportRunning = false;this.poNotification.success("Relat??rio de pre??os requerido com sucesso!");}, error =>{this.isExportRunning = false;this.poNotification.error("Erro na demanda do relat??rio de pre??os");} );
    }
    this.relatorioConfirmation.close();
  }

  requerirRelatorioPuDeEventos() {
    if(this.role == "reader") {
      this.poNotification.error("Usu??rio n??o autorizado");
    }
    else {
      this.isExportRunning = true;
      this.service.getRelatorioPuDeEventos().subscribe(() => { this.isExportRunning = false; this.poNotification.success("Relat??rio PU Eventos requerido com sucesso!"); }, error => {this.isExportRunning = false;this.poNotification.error("Erro na demanda do relat??rio de PU Eventos") });
    }
    this.relatorioConfirmation.close();
  }

  disasterRecovery() {
    this.modalDisaster.close();
    if(this.role != "admin") {
      this.poNotification.error("Usu??rio n??o autorizado");
    }
    else {
      this.isExportRunning = true;
      this.service.disasterRecovery(this.formDisasterRecovery.getRawValue()).subscribe(() => {
        this.poNotification.success("Recovery requerido com sucesso!");
        this.isExportRunning = false;
        //setTimeout(()=> window.location.reload(), 2000); 
      }, error =>{this.poNotification.error("Erro na demanda do recovery");this.isExportRunning = false;} );
    }
    
  
  }

  disasterRecoveryUnitario() {
    this.modalDisasterUnitario.close();
    if(this.role != "admin") {
      this.poNotification.error("Usu??rio n??o autorizado");
    }
    else {
      this.isExportRunning = true;
      var params = {data : this.formDisasterRecoveryUnitario.getRawValue().data};
      this.service.disasterRecoveryUnitario(this.papelRecovery,params).subscribe(() => {
        this.poNotification.success("Recovery unit??rio requerido com sucesso!");
        this.isExportRunning = false;
        //setTimeout(()=> window.location.reload(), 2000); 
      }, error =>{this.poNotification.error("Erro na demanda do recovery unit??rio");this.isExportRunning = false;} );
    }
    
  }

  disasterRecoveryUnitarioEditModal() {
    var params = this.formDisasterRecoveryUnitario.getRawValue();
    this.papelRecovery = params.papel;
    this.modalDisasterUnitario.open();

  }

  openModal() {
    if (this.role == "reader") {
      this.poNotification.error("Usu??rio n??o autorizado");
    }
    else {
      this.loteMod.open();
    }
  }

  clickTemplate() {
    this.service.downloadCSVCadastro();
  }

  uploadSuccess(event) {
    this.loadingCadastroLote = false;
    if (event.status == 200) {
      this.poNotification.success('Atualiza????es de cadastros realizada com sucesso');
    }
    else {
      this.poNotification.error('Erro em atualiza????es de cadastros via CSV');
    }
  }

  triggerLoadingOv() {
    this.loadingCadastroLote = true;
  }

  notifyError() {
    this.loadingCadastroLote = false;
    this.poNotification.error('Erro em atualiza????es de cadastros via CSV');
  }
}
