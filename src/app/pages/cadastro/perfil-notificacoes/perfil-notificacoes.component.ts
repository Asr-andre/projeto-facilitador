import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { OrdenarPeloHeaderTabela } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
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
export class PerfilNotificacoesComponent implements OnInit {
  public login = this._auth.getLogin();
  public idEmpresa = this._auth.getIdEmpresa();
  public loading: boolean = false;
  public loadingMin: boolean = false;
  public perfil: Dados[] = [];
  public formPerfilNotificacoes: FormGroup;

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
    private _fb: FormBuilder,
    private _modal: NgbModal,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _funcoes: FuncoesService,
    private _route: Router
  ) { }

  ngOnInit(): void {
    this.obterPerfilNotificacoes();
    this.inicializarFom();
  }

  public inicializarFom() {
    this.formPerfilNotificacoes = this._fb.group({
      sigla: ["", Validators.required],
      descricao: ["", Validators.required],
      user_login: [this.login]
    });
  }

  public obterPerfilNotificacoes() {
    const dados = { id_empresa: this.idEmpresa, user_login: this.login }

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

  public abrirModalCadastro(content: TemplateRef<any>): void {
    this.inicializarFom();
    this._modal.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarPerfilNotificacao(): void {
    if (this.formPerfilNotificacoes.invalid) {
      this._funcoes.camposInvalidos(this.formPerfilNotificacoes);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    this.loadingMin = true;
    this._perfilNotificacoes.cadastrarPerfilNotificacao(this.formPerfilNotificacoes.value).pipe(finalize(() => { this.loadingMin = false; })).subscribe({
      next: (res) => {
        if (res.success === 'true') {
          this.fechar();
          this.obterPerfilNotificacoes();
          this._alert.success(res.msg);
        } else {
          this._alert.warning(res.msg);
        }
      },
      error: (err) => {
        this._alert.error('Erro:', err);
      }
    });
  }

  public editar(sigla: string): void {
    this._route.navigate([`/cadastro/perfil-notificacoes/editar/${sigla}`]);
  }

  public fechar() {
    this.formPerfilNotificacoes.reset();
    this._modal.dismissAll();
  }
}
