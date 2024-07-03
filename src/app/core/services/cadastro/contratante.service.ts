import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RetornoModel } from '../../models/retorno.model';
import { AppConfig } from '../url.base.service';
import { ContratanteModel } from '../../models/cadastro/contratante.model';
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

  public obterContratantePorEmpresa(): Observable<ContratanteModel[]> {
    const idEmpresa = this._authService.getIdEmpresa();

    return this._http.get<ContratanteModel | ContratanteModel[]>(`${this.apiUrl}/contratante/porempresa/${idEmpresa}`).pipe(
      map(response => Array.isArray(response) ? response : [response]),
        catchError(error => {
          console.error('Erro ao obter contratantes', error);
          return of([]);
        })
      );
  }

  public cadastrarContratante(contratante: ContratanteModel) {
    return this._http.post<RetornoModel>(`${this.apiUrl}/contratante`, contratante);
  }
}
