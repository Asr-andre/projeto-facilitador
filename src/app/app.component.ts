import { Component, HostListener } from '@angular/core';
import { AuthenticationService } from './core/services/auth.service';
import { AppConfig } from './core/services/url.base.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();

  constructor(private _auth: AuthenticationService) {}

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification(event: any): void {
    // Verifica se o evento é devido a um fechamento de aba ou navegador
    if (!this.isPageReload()) {
      this.sendLogout(event);
    }
  }

  private isPageReload(): boolean {
    // Verifica se é uma atualização (reload) da página
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isReload = navigationEntries.length > 0 && navigationEntries[0].type === 'reload';

    // Se for um reload, retorna true, caso contrário false
    return isReload;
  }

  private sendLogout(event: any): void {
    const dados = {
      id_empresa: this.idEmpresa,
      user_login: this.login,
      data_logout: this.formatarDataLogout(new Date())
    };

    // Envia o logout usando sendBeacon
    if (navigator.sendBeacon) {
      const url = `${AppConfig.apiUrl}/logout`;
      const payload = JSON.stringify(dados);
      navigator.sendBeacon(url, payload);
    } else {
      // Caso o sendBeacon não esteja disponível, usamos XMLHttpRequest
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${AppConfig.apiUrl}/logout`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(dados));
    }
  }

  private formatarDataLogout(data: Date): string {
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const dia = pad(data.getDate());
    const mes = pad(data.getMonth() + 1);
    const ano = data.getFullYear();
    const horas = pad(data.getHours());
    const minutos = pad(data.getMinutes());
    const segundos = pad(data.getSeconds());
    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  }
}
