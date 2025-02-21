import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';  // Supondo que você tenha um serviço de alerta

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private alertService: AlertService  // Serviço para exibir mensagens de erro
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(err => {
                // Tratamento específico para erro 401 (não autorizado)
                if (err.status === 401) {
                    // Realizar logout em caso de erro 401
                    this.authenticationService.logout();
                    location.reload();  // Recarregar a página após o logout
                    return throwError('Sessão expirada. Você foi desconectado.');
                }

                // Tratamento para erro 404 (não encontrado)
                if (err.status === 404) {
                    const errorMessage = 'Recurso não encontrado. Por favor, verifique a URL.';
                    this.alertService.error(errorMessage);  // Exibir mensagem de erro
                    return throwError(errorMessage);
                }

                // Tratamento para erro 400 (bad request)
                if (err.status === 400) {
                    const errorMessage = 'A solicitação não foi bem-sucedida. Verifique os dados enviados.';
                    this.alertService.error(errorMessage);  // Exibir mensagem de erro
                    return throwError(errorMessage);
                }

                // Erros do lado do servidor (por exemplo, 500, 502, etc.)
                if (err.status >= 500) {
                    const errorMessage = 'Erro interno no servidor. Tente novamente mais tarde.';
                    this.alertService.error(errorMessage);  // Exibir mensagem de erro
                    return throwError(errorMessage);
                }

                // Outros erros de comunicação com a API ou erros não especificados
                const errorMessage = err.error?.msg || err.error?.message || err.statusText || 'Ocorreu um erro desconhecido.';
                this.alertService.error(errorMessage);  // Exibir a mensagem de erro
                return throwError(errorMessage);
            })
        );
    }
}
