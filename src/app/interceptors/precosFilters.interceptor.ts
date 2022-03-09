import { Injectable } from "@angular/core";
import {
    HttpEvent,
    HttpRequest,
    HttpHandler,
    HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";
import { EndpointsApi } from '../models/EndpointsApi'

@Injectable()
export class PrecosFiltersInterceptor implements HttpInterceptor {
    paramsString: string = '';
    eachParamArray: string[] = [];
    lastFiltersUsed : any;
    
    constructor(private apiConfig: EndpointsApi) {
        this.paramsString = '';
        this.eachParamArray = [];
        this.lastFiltersUsed = {}
    }
    intercept(req: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes(this.apiConfig.PrecoCSVURL())) {
            var reqmodified = this.handleCSVFiltered(req, next);
            return next.handle(reqmodified);
        }
        else if (req.url.includes(this.apiConfig.RelatorioPreco())) {
            this.handleFilterInput(req);
        }
        return next.handle(req);
    }
    
    handleCSVFiltered(req: HttpRequest<any>,next: HttpHandler){
        var paramsReq : any =  {dia: false};
        paramsReq = {...this.parseReqParams(req)};
        if(paramsReq.dia) {
            return req;
        }

        let params: {dataCriacaoInicio?: string, dataCriacaoFim?: string, dataEvento?: string, horaCriacaoInicio?: string, horaCriacaoFim?: string, codigoSNA?: string, tipo?: string} = this.lastFiltersUsed;
        // if(params.dataCriacao!=null)
        // {
        //     params.data = params.dataCriacao;
        // }
        if(params!={})
        {
            var modified = req.clone({ setParams: params });
            return modified
        }
    }
    
    handleFilterInput(req: HttpRequest<any>){
        this.lastFiltersUsed = this.parseReqParams(req);
    }

    parseReqParams(req: HttpRequest<any>){
        
        this.paramsString = decodeURIComponent(req.urlWithParams).split('?')[1];
        if(this.paramsString != null)
        {
            let params = {};            
            this.eachParamArray = this.paramsString.split('&');
            this.eachParamArray.forEach((param) => {
                const key = param.split('=')[0];
                const value = param.split('=')[1];
                Object.assign(params, {[key]: value});
            });
            return params;
        }
    }
}