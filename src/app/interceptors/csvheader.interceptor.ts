import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";
import { EndpointsApi } from '../models/EndpointsApi'
import { MsalService } from "@azure/msal-angular";

@Injectable()
export class CSVHeaderInterceptor implements HttpInterceptor {
  
  constructor(private apiConfig: EndpointsApi,private authService: MsalService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes(this.apiConfig.AssinaturaCSVURL())&&req.method=="POST") {
      const modified = req.clone({ setHeaders: { "user": this.authService.getAccount().userName } });
      return next.handle(modified);
    }
    if (req.url.includes(this.apiConfig.CadastroLoteURL()) && req.method == "POST") {
      const modified = req.clone({ setHeaders: { "user": this.authService.getAccount().userName } });
      return next.handle(modified);
    }
    return next.handle(req);
  }
}
