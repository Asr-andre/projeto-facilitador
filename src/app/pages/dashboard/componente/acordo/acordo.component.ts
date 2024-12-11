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

  public idsSelecionados: string[] = [];

  constructor(
    private _acordoService: AcordoService,
    private _authService: AuthenticationService,
    private _alertService: AlertService,
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

  public toggleSelecao(id: string, selecionado: boolean): void {
    if (selecionado) {
      this.idsSelecionados.push(id); // Adiciona o ID à lista
    } else {
      this.idsSelecionados = this.idsSelecionados.filter((item) => item !== id); // Remove o ID da lista
    }
  }

  public gerarConfissaoDivida(): void {
    if (this.idsSelecionados.length === 0) {
      this._alertService.info(`Nenhum acordo selecionado!`);
      return;
    }

    this.idsSelecionados.forEach((idAcordo) => {
      const dadosSelecionado = {
        id_empresa: this.idEmpresa,
        id_contratante: this.idContratante,
        id_cliente: this.idCliente,
        id_acordo: idAcordo,
        user_login: this.login,
      };

      this.loadingMin = true;
      this._acordoService.imprimirConfissaoDivida(dadosSelecionado).subscribe(
        (res) => {
          var link = "data:application/pdf;base64, " + res.base64;
          fetch(link).then(res => res.blob()).then(res => window.open(URL.createObjectURL(res), '_blank'));
          this._alertService.success(res.msg);
          this.loadingMin = false;
        },
        (error) => {
          this.loadingMin = false;
          this._alertService.error(`Erro ao gerar confissão de dívida para o acordo: ${idAcordo}`, error);
        }
      );
    });
  }

  public dataBrasil(data) {
    return Utils.dataBrasil(data);
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }

  public status(tipo: string): string {
    switch (tipo) {
      case 'A': return 'Ativo';
      case 'C': return 'Cancelado';
      default: return 'Desconhecido';
    }
  }
}
