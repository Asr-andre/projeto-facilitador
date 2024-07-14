import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
      this.loading = false;
    },
    (error) => {
      this._alertService.error('Ocorreu um erro ao obter os usuários.');
      this.loading = false;
    });
  }

  public abrirModalCadastro(content: TemplateRef<any>): void {
    this._modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title' });
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

}
