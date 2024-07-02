import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RetornoModel } from '../../models/retorno.model';
import { AppConfig } from '../url.base.service';
import { ContratanteModel } from '../../models/cadastro/contratante.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratanteService {

  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient) { }

  public obterContratantes(): Observable<ContratanteModel[]> {
    return this._http.get<ContratanteModel[]>(`${this.apiUrl}/contratante`);
  }

  public cadastrarContratante(contratante: ContratanteModel) {
    return this._http.post<RetornoModel>(`${this.apiUrl}/contratante`, contratante);
  }
}
