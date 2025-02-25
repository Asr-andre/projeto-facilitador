import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { Dados } from 'src/app/core/models/cadastro/perfil.notificacao.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { PerfilNotificacoesService } from 'src/app/core/services/cadastro/perfil.notificacao.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-perfil-notificacoes',
  templateUrl: './perfil-notificacoes.component.html',
  styleUrl: './perfil-notificacoes.component.scss'
})
export class PerfilNotificacoesComponent implements OnInit{
  public login = this._auth.getLogin();
  public sigla: string = "ASAAS"
  public loading: boolean = false;
  public perfil: Dados [] = [];

    public paginaAtual: number = 1;
    public itensPorPagina: number = 10;
    public dadosFiltrados: Dados[] = [];
    public textoPesquisa: string = '';
    public totalRegistros: number = 0;
    public totalRegistrosExibidos: number = 0;
    public qtdRegistrosPorPagina = [10, 25, 50, 100];
    public direcaoOrdenacao: { [key: string]: string } = {};
    @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<Dados>>;

  constructor(
    private _perfilNotificacoes: PerfilNotificacoesService,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _funcoes: FuncoesService
  ) {  }

  ngOnInit(): void {
    this.obterPerfilNotificacoes();
  }

  public obterPerfilNotificacoes() {
    const dados = {
      sigla: this.sigla,
      user_login: this.login
    }

    this.loading = true;
    this._perfilNotificacoes.obterPerfilNotificacoes(dados).subscribe((res) => {
      this.perfil = res.dados;
      this.filtrar();
      this.atualizarQuantidadeExibida();
      this.loading = false;
    },
      (error) => {
        this._alert.error('Ocorreu um erro ao obter os dados.');
        this.loading = false;
      }
    );
  }

  public filtrar(): void {
      this.dadosFiltrados = Utils.filtrar(this.perfil, this.textoPesquisa);
      this.totalRegistros = this.dadosFiltrados.length;
    }

    public atualizarQuantidadeExibida() {
      this.totalRegistrosExibidos = Math.min(this.paginaAtual * this.itensPorPagina, this.totalRegistros);
    }
}
