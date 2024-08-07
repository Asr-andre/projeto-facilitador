import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { FilaModel } from 'src/app/core/models/fila.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FilaService } from 'src/app/core/services/fila.service';

@Component({
  selector: 'app-fila',
  templateUrl: './fila.component.html',
  styleUrl: './fila.component.scss'
})
export class FilaComponent implements OnInit {
  public loading: boolean =false;
  public filas: FilaModel[]=[];
  public loadingMin: boolean = false;
  public id_empresa = Number(this._authService.getIdEmpresa());
  public user_login = this._authService.getLogin();

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: FilaModel[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<any>>;

  constructor(
    private _filaService: FilaService,
    private _authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.obterFilas();
  }

  public obterFilas() {
    this.loading = true;
    const requisicao = {
     id_empresa: this.id_empresa,
     user_login: this.user_login
    }

    this._filaService.obterFilas(requisicao).subscribe((res) => {
      this.filas = res.filas;
      this.filtrar();
      this.atualizarQuantidadeExibida();
      this.loading = false;
    });
  }

  public filtrar(): void {
    this.dadosFiltrados = Utils.filtrar(this.filas, this.textoPesquisa);
    this.totalRegistros = this.dadosFiltrados.length;
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(this.paginaAtual * this.itensPorPagina, this.totalRegistros);
  }

  public ordenar({ column, direction }: SortEvent<any>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.filas;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }
}
