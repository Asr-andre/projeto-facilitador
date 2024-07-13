import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RetornoModel } from '../../models/retorno.model';
import { AppConfig } from '../url.base.service';
import { ContratanteModel, ContratantesRetornoModel } from '../../models/cadastro/contratante.model';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthenticationService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContratanteService {

  private apiUrl = AppConfig.apiUrl;

  constructor(private _http: HttpClient, private _authService: AuthenticationService) { }

  public obterContratantes(): Observable<ContratanteModel[]> {
    return this._http.get<ContratanteModel[]>(`${this.apiUrl}/contratante`);
  }

  public obterContratantePorEmpresa(idEmpresa: number): Observable<ContratantesRetornoModel> {
    return this._http.post<ContratantesRetornoModel>(`${this.apiUrl}/contratante/listarporempresa`, { id_empresa: idEmpresa });
  }

  public cadastrarContratante(contratante: ContratanteModel) {
    return this._http.post<RetornoModel>(`${this.apiUrl}/contratante`, contratante);
  }
}
