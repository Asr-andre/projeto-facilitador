import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DevedorModel } from '../models/devedor.model';
import { DetalhamentoModel } from '../models/detalhamento.model';
import { ClienteModel } from '../models/acionamento.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'assets/base/Devedores.json';
  private detalhamentoUrl  = 'assets/base/Detalhamento.json';
  private acionamentoUrl  = 'assets/base/Acionamento.json';

  constructor(
    private _http: HttpClient
  ) { }

  public obterDevedores(): Observable<DevedorModel[]> {
    return this._http.get<DevedorModel[]>(this.apiUrl);
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
