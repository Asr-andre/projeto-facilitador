import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TituloModel } from 'src/app/core/models/titulos.pg.ret.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { TitulosPgRetService } from 'src/app/core/services/titulos.pg.ret.service';

@Component({
  selector: 'app-titulos-pg-ret',
  templateUrl: './titulos-pg-ret.component.html',
  styleUrls: ['./titulos-pg-ret.component.scss']
})
export class TitulosPgRetComponent implements OnInit, OnChanges {
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public login = this._authService.getLogin();
  public tituloPgRet: TituloModel[] = [];
  public loadingMin: boolean = false;

  constructor(
    private _titulosPgRetService: TitulosPgRetService,
    private _authService: AuthenticationService,
    private _alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.obterTitulosPagos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente && !changes.idCliente.firstChange) {
      this.obterTitulosPagos();
    }
  }

  public obterTitulosPagos() {
    if (!this.idCliente) return;

    const request = {
      id_empresa: this.idEmpresa,
      id_contratante: this.idContratante!,
      id_cliente: this.idCliente!,
      user_login: this.login
    };

    this.loadingMin = true;
    this._titulosPgRetService.obterTitulosPagosRet(request).subscribe((res) => {
        this.tituloPgRet = res.titulos;
        this.loadingMin = false;
      },
      (error) => {
        this.loadingMin = false;
        this._alertService.error('Erro ao buscar títulos pagos/retirados.');
      }
    );
  }

  public tipo(tipo: string): string {
    switch (tipo) {
      case 'P':
        return 'Pagamento';
      case 'R':
        return 'Retirada';
        case 'A':
        return 'Acordo';
      default:
        return tipo;
    }
  }
}
