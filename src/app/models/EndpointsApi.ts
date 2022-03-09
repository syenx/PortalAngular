import { Env, EnvConfig } from '../components/env-config/env-config';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class EndpointsApi {

    private base_url: string;

    constructor(envConfig: EnvConfig) {
        envConfig.getEnv().then(
            (env: Env) => {
              this.base_url = env.apiUrl;
            }
          );
    }

    public AssinaturaURL(): string {
        return `${this.base_url}/v1/Assinatura`;
    }

    public AssinaturaCSVURL(): string {
        return `${this.base_url}/v1/Assinatura/csv`;
    }

    public getAssinaturaPapelURL(papel: string): string {
        return `${this.base_url}/v1/Assinatura/${papel}`;
    }

    public getLogURL(): string {
        return `${this.base_url}/v1/Assinatura/log`;
    }

    public getCaracteristicaPapel(papel: string): string {
        return `${this.base_url}/v2/Caracteristica/${papel}`;
    }

    public RelatorioPreco(): string {
        return `${this.base_url}/v2/Preco`;
    }

    public RelatorioDiaPreco(): string {
        return `${this.base_url}/v2/Preco/relatorio-dia`;
    }

    public RelatorioDiaPuDeEventos(): string {
      return `${this.base_url}/v1/PuDeEventos/relatorio-dia`;
    }

    public DashboardPreco(): string {
        return `${this.base_url}/v1/Dashboard`;
    }
    public getPrecoPapelURL(papel: string): string {
        return `${this.base_url}/v2/Preco/${papel}`;
    }

    public PrecoCSVURL(): string {
        return `${this.base_url}/v2/Preco/csv`;
    }
    public PrecoHistCSVURL(): string {
        return `${this.base_url}/v2/Preco/csvHist`;
    }

    public getFluxoPapelURL(papel: string): string {
        return `${this.base_url}/v2/Fluxo/${papel}`;
    }
    public Rastreamento(): string {
        return `${this.base_url}/v1/Rastreamento`;
    }
    public TipoPapelURL(): string {
        return `${this.base_url}/v2/Preco/tipo`;
    }
    public LastAttPrecoURL(): string {
        return `${this.base_url}/v2/Preco/ultimaAtt`;
    }
    public CadastroCSVURL(): string {
      return `${this.base_url}/v2/Caracteristica/csv`;
    }
    public FluxoCSVURL(): string {
      return `${this.base_url}/v2/Fluxo/csv`;
    }

    public RelatorioDiaCaracteristica(): string {
        return `${this.base_url}/v2/Caracteristica/relatorio-dia`;
    }

    public CadastroUnitarioURL(papel: string): string {
      return `${this.base_url}/v2/Caracteristica/relatorio-dia/${papel}`;
    }

    public CadastroLoteURL(): string {
      return `${this.base_url}/v2/Caracteristica/relatorio-dia/lote`;
    }

    public PrecoHistoricoUnitarioURL(papel: string): string {
      return `${this.base_url}/v1/Historico/${papel}`;
    }

    public PuDeEventosUnitarioURL(papel: string): string {
      return `${this.base_url}/v1/PuDeEventos/${papel}`;
    }

    public RastreamentoEventoURL(): string {
        return `${this.base_url}/v2/Rastreamento/evento`;
    }

    public RastreamentoPapelURL(): string {
        return `${this.base_url}/v2/Rastreamento/papel`;
    }

    public DisasterRecoveryURL(): string {
        return `${this.base_url}/v1/Recovery/relatorio-dia`;
    }

    public DisasterRecoveryUnitarioURL(papel: string): string {
      return `${this.base_url}/v1/Recovery/relatorio-dia/${papel}`;
    }

    public RastreamentoEventoCSVURL(): string {
        return `${this.base_url}/v2/Rastreamento/evento/csv`;
    }

    public RastreamentoPapelCSVURL(): string {
        return `${this.base_url}/v2/Rastreamento/papel/csv`;
    }

    public DashboardsURL(): string {
        return `${this.base_url}/v2/Dashboard`;
    }
}
