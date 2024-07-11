import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from './url.base.service';
import { EmailModel } from '../models/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = AppConfig.apiUrl;
  private emailUrl  = 'assets/base/emails.json';

  constructor(
    private _http: HttpClient,

  ) { }

  public obterEmailPorIdcliente(idCliente: number): Observable<EmailModel[]> {
    return this._http.get<EmailModel[]>(this.emailUrl).pipe(
      map((emails: EmailModel[]) => emails.filter(email => email.id_cliente === idCliente))
    );
  }
}
