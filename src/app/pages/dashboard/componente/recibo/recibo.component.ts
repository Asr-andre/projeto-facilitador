import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { Recibos } from 'src/app/core/models/recibo.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ReciboService } from 'src/app/core/services/recibo.service';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrl: './recibo.component.scss'
})
export class ReciboComponent implements OnInit, OnChanges {
  @Input() idCliente: number | undefined;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();
  public loadingMin: boolean =false;
  public recibos: Recibos[] = [];
  public idsSelecionados: string[] = [];

  public dadosFiltrados: Recibos[] = [];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<Recibos>>;

  constructor(
    private _recibo: ReciboService,
    private _auth: AuthenticationService,
    private _alert: AlertService,
  ) { }

  ngOnInit(): void {
    this.obterRecibos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente && !changes.idCliente.firstChange) {
      this.obterRecibos();
    }
  }

  public obterRecibos() {
    if (!this.idCliente) return;

    const request = {
      id_cliente: this.idCliente!,
      id_empresa: this.idEmpresa,
      user_login: this.login
    };

    this.loadingMin = true;
    this._recibo.obterRecibos(request).subscribe(
      (res) => {
        if (res.success === 'true') {
          this.recibos = res.recibos;
          this.dadosFiltrados = res.recibos;
        } else {
          this._alert.warning(res.msg);
        }
        this.loadingMin = false;
      },
      (error) => {
        this.loadingMin = false;
        const mensagemErro = error.error?.message || 'Erro ao obter os recibos. Por favor, tente novamente.';
        this._alert.error(mensagemErro);
      }
    );
  }

  public ordenar({ column, direction }: SortEvent<Recibos>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.recibos;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public toggleSelecao(id: string, selecionado: boolean): void {
    if (selecionado) {
      this.idsSelecionados.push(id);
    } else {
      this.idsSelecionados = this.idsSelecionados.filter((item) => item !== id);
    }
  }

  public imprimirRecibo(): void {
    if (this.idsSelecionados.length === 0) {
      this._alert.info(`Nenhum recibo selecionado!`);
      return;
    }

    this.idsSelecionados.forEach((idRecibo) => {
      const dadosSelecionado = {
        id_cliente: this.idCliente,
        id_recibo: idRecibo,
        user_login: this.login,
      };

      this._alert.impressaoDocumento();
      this._recibo.imprimirRecibos(dadosSelecionado).subscribe(
        (res) => {
          var link = "data:application/pdf;base64, " + res.base64;
          fetch(link).then(res => res.blob()).then(res => window.open(URL.createObjectURL(res), '_blank'));
          this._alert.success(res.msg);
        },
        (error) => {
          const mensagemErro = error.error?.message || 'Erro ao imprimir os recibos. Por favor, tente novamente.';
          this._alert.error(mensagemErro);
        }
      );
    });
  }

  async cancelarRecibo(recibo: any) {
    const solicitacao = {
      id_cliente: this.idCliente,
      id_recibo: recibo.id_recibo,
      user_login: this.login
    };

    const confirmarCancelamento = await this._alert.cancelarRecibo();
    if (!confirmarCancelamento) {
      return;
    }

    try {
      const resposta = await this._recibo.cancelarRecibos(solicitacao).toPromise();
      if (resposta.success) {
        this._alert.success(resposta.msg);
        this.obterRecibos();
      } else {
        this._alert.warning(resposta.msg);
      }
    } catch (error) {
      this._alert.error('Erro ao cancelar o recibo', error);
    }
  }

  public status(status: string): string {
    switch (status) {
      case 'S':
        return 'Cancelado';
      case 'N':
        return 'Em aberto';
      default:
        return status;
    }
  }

  public dataBrasil(data) {
    return Utils.dataBrasil(data);
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }
}
