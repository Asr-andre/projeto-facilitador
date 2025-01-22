import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../url.base.service';
import { Observable } from 'rxjs';
import { RequisicaoPesquisaModel, RetornoPesquisaModel } from '../../models/relatorio/juridico.model';

@Injectable({
  providedIn: 'root'
})
export class JuridicoService {
  private apiUrl = AppConfig.apiUrl;

  constructor(
    private _http: HttpClient
  ) { }

  public pesquisarJuridico(dados: RequisicaoPesquisaModel): Observable<RetornoPesquisaModel>{
    return this._http.post<RetornoPesquisaModel>(`${this.apiUrl}/relatoriojuridico`, dados);
  }

}
