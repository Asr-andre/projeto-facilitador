import { Utils } from 'src/app/core/helpers/utils';
import { AcordoModel, AcordoRequisicaoModel, AcordoRespostaModel } from './../../../../core/models/acordo.model';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AcordoService } from 'src/app/core/services/acordo.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-acordo',
  templateUrl: './acordo.component.html',
  styleUrl: './acordo.component.scss'
})
export class AcordoComponent implements OnInit, OnChanges {
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public login = this._authService.getLogin();
  public loadingMin: boolean = false;
  public acordos: AcordoModel[] = [];

  constructor(
    private _acordoService: AcordoService,
    private _authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
  this.listarAcordos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente && !changes.idCliente.firstChange) {
        this.listarAcordos();
    }
  }

  public  listarAcordos(): void {
    const requisicao: AcordoRequisicaoModel = {
      id_empresa: this.idEmpresa,
      id_contratante: this.idContratante,
      id_cliente: this.idCliente,
      user_login: this.login
    };
    this.loadingMin = true;
    this._acordoService.listarAcordos(requisicao).subscribe(
      (res: AcordoRespostaModel) => {
        if (res.success === 'true') {
          this.acordos = res.acordos;
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          console.error('Erro ao listar acordos:', res.msg);
        }
      },
      (error) => {
        this.loadingMin = false;
        console.error('Erro ao listar acordos:', error);
      }
    );
  }

  public dataBrasil(data) {
    return Utils.dataBrasil(data);
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }
}
