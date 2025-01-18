import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { Recibos } from 'src/app/core/models/recibo.nodel';
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
    private _reciboService: ReciboService,
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
    this._reciboService.obterRecibos(request).subscribe((res) => {
      if (res.success === 'true') {
        this.recibos = res.recibos;
        this.dadosFiltrados = res.recibos;
        this.loadingMin = false;
      } else {
        this._alert.warning(res.msg);
      }
    },
      (error) => {
        this.loadingMin = false;
        this._alert.error('Erro ao obter os boletos.',error);
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
      this.idsSelecionados.push(id); // Adiciona o ID à lista
    } else {
      this.idsSelecionados = this.idsSelecionados.filter((item) => item !== id); // Remove o ID da lista
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
