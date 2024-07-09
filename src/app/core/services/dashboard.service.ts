import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DevedorModel } from '../models/devedor.model';
import { DetalhamentoModel } from '../models/detalhamento.model';
import { ClienteModel } from '../models/acionamento.model';
import { AppConfig } from './url.base.service';
import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = AppConfig.apiUrl;
  private detalhamentoUrl  = 'assets/base/Detalhamento.json';
  private acionamentoUrl  = 'assets/base/Acionamento.json';

  constructor(
    private _http: HttpClient,
    private _authService: AuthenticationService
  ) { }

  public obterDevedores(): Observable<DevedorModel[]> {
    const idEmpresa = parseInt(this._authService.getIdEmpresa(), 10);
    const requestBody = { id_empresa: idEmpresa };
    return this._http.post<DevedorModel[]>(`${this.apiUrl}/listarcliente`, requestBody);
  }

  public obterDevedorPorId(id: number): Observable<DevedorModel> {
    return this._http.get<DevedorModel[]>(this.apiUrl).pipe(
      map(devedores => devedores.find(devedor => devedor.id_cliente === id))
    );
  }

  public obterDetalhamentoPorId(id: number): Observable<DetalhamentoModel | undefined> {
    return this._http.get<DetalhamentoModel[]>(this.detalhamentoUrl).pipe(
      map(detalhamentos => detalhamentos.find(detalhamento => detalhamento.id_cliente === id))
    );
  }

  public obterAcionamentosDoDevedor(id: number): Observable<ClienteModel | undefined> {
    return this._http.get<ClienteModel[]>(this.acionamentoUrl).pipe(
      map(devedores => devedores.find(devedor => devedor.id_cliente === id))
    );
  }

  enviarMensagem(telefone: string, mensagem: string): void {
    const mensagemEncoded = encodeURIComponent(mensagem);
    const url = `https://api.whatsapp.com/send?phone=${telefone}&text=${mensagemEncoded}`;
    window.open(url, '_blank');
  }
}
