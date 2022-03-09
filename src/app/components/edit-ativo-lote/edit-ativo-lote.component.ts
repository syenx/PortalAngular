import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { PoUploadComponent } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { Env, EnvConfig } from '../env-config/env-config';

const actionInsert = 'insert';
const actionUpdate = 'update';

@Component({
  templateUrl: './edit-ativo-lote.component.html',
  styleUrls: ['./edit-ativo-lote.component.css']
})
export class EditAtivoLoteComponent implements OnInit {

  restrictions = { allowedExtensions: ['.csv'] };
  @ViewChild('upload', { static: true }) upload: PoUploadComponent;

  sign_url: string; //= environment.apiUrl;
  private rowSub: Subscription;

  constructor(
    private authService: MsalService,
    envConfig: EnvConfig) {
      envConfig.getEnv().then(
        (env: Env) => {
          this.sign_url = env.apiUrl + "/Assinatura/csv";
        }
      );
     }

  ngOnInit(): void {
  }

}
