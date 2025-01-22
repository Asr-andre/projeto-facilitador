import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { UsuarioModel } from 'src/app/core/models/cadastro/usuario.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UsuarioService } from 'src/app/core/services/cadastro/usuario.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  public usuarios: UsuarioModel[];
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public sigla = this._auth.getSigla();
  public login = this._auth.getLogin();
  public formUsuario: FormGroup;
  public loading: boolean =false;
  public loadingMin: boolean = false;
  public editar: boolean = false;

  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public dadosFiltrados: UsuarioModel[] = [];
  public textoPesquisa: string = '';
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<UsuarioModel>>;

  constructor(
    private _usuarioService: UsuarioService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _funcoes: FuncoesService
  ) { }

  ngOnInit(): void {
    this.obterUsuarios();
    this.inicializarFormUsuario();
  }

  public inicializarFormUsuario(dado?: UsuarioModel) {
    this.formUsuario = this._formBuilder.group({
      id_usuario: [dado?.id_usuario || ''],
      id_empresa: [this.idEmpresa],
      sigla: [this.sigla],
      login: [dado?.login || '', Validators.required],
      nome: [dado?.nome || '', Validators.required],
      cpf: [dado?.cpf || ''],
      email: [dado?.email || '', Validators.required],
      tipo: ['A'],
      fone: [dado?.fone || ''],
      ATIVO: ['S'],
      senha: [dado?.senha || ''],
      user_login: [this.login],
    });
  }

  public controleBotao() {
    if (this.formUsuario.invalid) {
      this._funcoes.camposInvalidos(this.formUsuario);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    if(this.editar == false) {
      this.cadastrarUsuario();
    } else {
      this.editarUsuario();
    }
  }

  public obterUsuarios() {
    this.loading = true;
    this._usuarioService.obterUsuariosPorEmpresa(this.idEmpresa).subscribe((res) => {
      this.usuarios = res.contratantes;
      this.filtrar();
      this.atualizarQuantidadeExibida();
      this.loading = false;
    },
    (error) => {
      this._alert.error('Ocorreu um erro ao obter os usuários.');
      this.loading = false;
    });
  }

  public filtrar(): void {
    this.dadosFiltrados = Utils.filtrar(this.usuarios, this.textoPesquisa);
    this.totalRegistros = this.dadosFiltrados.length;
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(this.paginaAtual * this.itensPorPagina, this.totalRegistros);
  }

  public ordenar({ column, direction }: SortEvent<UsuarioModel>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.usuarios;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public abrirModalCadastro(content: TemplateRef<any>): void {
    this.editar = false;
    this.inicializarFormUsuario();
    this._modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarUsuario() {
    if (this.formUsuario.valid) {
      this.loading = true;
      this._usuarioService.cadastrarUsuario(this.formUsuario.value).subscribe((res) => {
        if (res && res.success === "true") {
          this.loading = false;
          this.obterUsuarios();
          this._alert.success(res.msg);
          this.fechar();
        } else {
          this.loading = false;
          this._alert.warning(res.msg);
        }
      },
      (error) => {
        this.loading = false;
        this._alert.error("Ocorreu um erro ao tentar cadastrar o usuário.");
      });
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public abrirModalEditar(content: TemplateRef<any>, dados: UsuarioModel): void {
    this.editar = true;
    this.inicializarFormUsuario(dados);
    this._modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public editarUsuario() {
    if (this.formUsuario.valid) {
      this.loading = true;
      this._usuarioService.editarUsuario(this.formUsuario.value).subscribe((res) => {
        if (res && res.success === "true") {
          this.loading = false;
          this.obterUsuarios();
          this._alert.success(res.msg);
          this.fechar();
        } else {
          this.loading = false;
          this._alert.warning(res.msg);
        }
      },
      (error) => {
        this.loading = false;
        this._alert.error("Ocorreu um erro ao tentar editar o usuário.", error);
      });
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public fechar() {
    this.formUsuario.reset();
    this._modalService.dismissAll();
  }

  public mostrarSenha(campoId: string, iconeId: string): void {
    Utils.alternarVisibilidadeSenha(campoId, iconeId);
  }
}
