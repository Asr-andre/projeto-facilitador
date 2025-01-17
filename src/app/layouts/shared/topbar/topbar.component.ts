import { Component, OnInit, Inject, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';
import { LanguageService } from '../../../core/services/language.service';
import { environment } from '../../../../environments/environment';
import { ChatVisibilidadeService } from 'src/app/core/services/chat.flutuante.service';
import { interval, Subscription } from 'rxjs';
import { SininhoService } from 'src/app/core/services/sininho.service';
import { AlertaModel } from 'src/app/core/models/sininho.model';
import { Utils } from 'src/app/core/helpers/utils';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { LogoutService } from 'src/app/core/services/logout.service';
import { Versao } from 'src/app/core/config/app.config';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit, OnDestroy {

  private pollingInterval = 60000; // 30 segundos
  private pollingSubscription: Subscription;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();
  public resMsg: AlertaModel[] = [];
  private canal = 'canal';

  @ViewChild('dropdown') dropdown: NgbDropdown;

  element: any;
  configData: any;
  cookieValue;
  flagvalue;
  countryName;
  valueset: string;
  currentUser: any;
  public versao: string;

  listLang = [
    { text: 'Brasil', flag: 'assets/images/flags/us.jpg', lang: 'en' },
  ];

  // tslint:disable-next-line: max-line-length
  constructor(@Inject(DOCUMENT)
  private document: any,
    private router: Router,
    private _auth: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    public languageService: LanguageService,
    public cookiesService: CookieService,
    private chatVisibilidadeService: ChatVisibilidadeService,
    private _sininhoService: SininhoService,
    private _logoutService: LogoutService
  ) {
    this.versao = Versao.versao;
  }

  @Output() mobileMenuButtonClicked = new EventEmitter();
  @Output() settingsButtonClicked = new EventEmitter();

  ngOnInit(): void {
    this.currentUser = this._auth.getLogin();
    this.element = document.documentElement;

    // metodo para fica monitorando as mensangens a cada 10 segundos
    //setTimeout(() => {
    //  this.monitorarMsg();
    //}, 10000);

  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  public monitorarMsg(): void {
    const requestBody = {
      id_empresa: this.idEmpresa
    };

    // Fazer a chamada inicial imediatamente
    this._sininhoService.monitorarMsg(requestBody).subscribe(res => {
      this.resMsg = res.alertas;
    });

    // Iniciar o polling
    this.pollingSubscription = interval(this.pollingInterval).subscribe(() => {
      this._sininhoService.monitorarMsg(requestBody).subscribe(res => {
        this.resMsg = res.alertas;
      });
    });
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  /**
   * Translate language
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
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

  /**
   * Logout the user
   */
  logout() {


    const dados = {
      id_empresa: this.idEmpresa,
      user_login: this.login,
      data_logout: this.formatarDataLogout(new Date())
    };

    this._logoutService.logout(dados).subscribe((res) => {
      if(res.success === 'true') {
        localStorage.clear();
        this._auth.logout();
        this.router.navigate(['/account/login']);
      }
    });

    if (environment.defaultauth === 'firebase') {
      this._auth.logout();
    } else {
      this.authFackservice.logout();
    }
    this.router.navigate(['/account/login']);

  }

  public abrirChat(telefone: string, canal: string, dropdown: NgbDropdown): void {

    localStorage.setItem(this.canal, canal);
    this.chatVisibilidadeService.mostrarChat(telefone); // Passa o telefone para o serviço
    dropdown.close(); // Fecha o dropdown após a interação
  }
}
