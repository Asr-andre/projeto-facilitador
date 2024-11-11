import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProcessoModel } from 'src/app/core/models/juridico.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { JuridicoService } from 'src/app/core/services/juridico.service';

@Component({
  selector: 'app-juridico',
  templateUrl: './juridico.component.html',
  styleUrl: './juridico.component.scss'
})
export class JuridicoComponent implements OnInit, OnChanges {
  @Input() idCliente: number | undefined;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();
  public loadingMin: boolean =false;
  public processos: ProcessoModel [] = [];

  constructor(
    private _JuridicoService: JuridicoService,
    private _auth: AuthenticationService,
    private _alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.obterProcessos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente && !changes.idCliente.firstChange) {

    }
  }

  public obterProcessos() {
    const request = {
      id_empresa: this.idEmpresa,
      user_login: this.login
    };

    this.loadingMin = true;
    this._JuridicoService.obterBoletoPix(request).subscribe((res) => {
      if (res.success === 'true') {
        this.processos = res.processos;
        this.loadingMin = false;
      } else {
        this.loadingMin = false;
        this._alertService.warning(res.msg);
      }
    },
      (error) => {
        this.loadingMin = false;
        this._alertService.error('Erro ao obter os boletos.',error);
      }
    );
  }
}
