import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { UsuarioModel } from 'src/app/core/models/cadastro/usuario.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UsuarioService } from 'src/app/core/services/cadastro/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  public usuarios: UsuarioModel[];
  public idEmpresa: number;
  public formUsuario: FormGroup;
  public loading: boolean =false;
  public loadingMin: boolean = false;

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
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.idEmpresa = Number(this._authenticationService.getIdEmpresa());
    this.obterUsuarios(this.idEmpresa);
    this.inicializarFormUsuario();
  }

  public inicializarFormUsuario() {
    this.formUsuario = this._formBuilder.group({
      id_empresa: [this.idEmpresa],
      sigla: [this._authenticationService.getSigla()],
      login: ["", Validators.required],
      nome: ["", Validators.required],
      cpf: [""],
      email: ["", Validators.required],
      tipo: [""],
      fone: [""],
      ATIVO: ["A"],
      senha: ["", Validators.required],
      user_login: [this._authenticationService.getLogin()],
    });
  }

  public obterUsuarios(idEmpresa: number) {
    this.loading = true;
    this._usuarioService.obterUsuariosPorEmpresa(idEmpresa).subscribe((res) => {
      this.usuarios = res.contratantes;
      this.filtrar();
      this.atualizarQuantidadeExibida();
      this.loading = false;
    },
    (error) => {
      this._alertService.error('Ocorreu um erro ao obter os usuários.');
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
    this._modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarUsuario() {
    if (this.formUsuario.valid) {
      this.loading = true;
      this._usuarioService.cadastrarUsuario(this.formUsuario.value).subscribe((res) => {
        if (res && res.success === "true") {
          this.loading = false;
          this.obterUsuarios(this.idEmpresa);
          this._alertService.success(res.msg);
          this._modalService.dismissAll();
        } else {
          this.loading = false;
          this._alertService.warning(res.msg);
        }
      },
      (error) => {
        this.loading = false;
        this._alertService.error("Ocorreu um erro ao tentar cadastrar o usuário.");
      });
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public mascararCpfCnpj(value: string): string {
    if (value) {
      return Utils.formatarDocumento(value);
    }
    return value;
  }

  public mascararTelefone(numero: string): string {
    if (numero) {
      return Utils.formatarTelefone(numero);
    }
    return numero;
  }

  public convertMaisculo(campo: AbstractControl) {
    return Utils.converterMaiuscula(campo);
  }

  public converterMinuscula(campo: AbstractControl) {
    return Utils.converterMinuscula(campo);
  }

}
