import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RetornoModel } from "src/app/core/models/retorno.model";
import { AlertService } from "src/app/core/services/alert.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { EmpresaService } from "src/app/core/services/empresa.service";

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
  styleUrl: "./usuario.component.scss",
})
export class UsuarioComponent implements OnInit, OnChanges {
  @Input() sigla: string;
  public formUsuario: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _empresaService: EmpresaService,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService
  ) {}

  ngOnInit() {
    this.inicializarformUsuario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idEmpresa && !changes.idEmpresa.firstChange) {
      this.formUsuario.patchValue({ sigla: this.sigla });
    }
  }

  inicializarformUsuario() {
    this.formUsuario = this._formBuilder.group({
      sigla: [this.sigla],
      login: ["", Validators.required],
      senha: ["", Validators.required],
      nome: ["", Validators.required],
      cpf: ["43324343", Validators.required],
      email: ["teste@teste.com", [Validators.required, Validators.email]],
      tipo: ["s", Validators.required],
      fone: ["323232", Validators.required],
      user_login: [this._authenticationService.getLogin()],
    });
  }

  public cadastrarUsuario() {
    if (this.formUsuario.valid) {
      this._empresaService.cadastrarUsuario(this.formUsuario.value).subscribe((res: RetornoModel) => {
          if (res && res.success === "true") {
            this._alertService.success(res.msg);
          } else {
            this._alertService.warning(res.msg);
          }
        },
        (error) => {
          this._alertService.error( "Ocorreu um erro ao tentar cadastrar o usuário." );
        }
      );
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }
}
