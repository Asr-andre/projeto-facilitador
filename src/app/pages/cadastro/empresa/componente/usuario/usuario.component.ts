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
import { EmpresaService } from "src/app/core/services/cadastro/empresa.service";
import { FuncoesService } from "src/app/core/services/funcoes.service";

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
  styleUrl: "./usuario.component.scss",
})
export class UsuarioComponent implements OnInit, OnChanges {
  @Input() sigla: string;
  public formUsuario: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _empresa: EmpresaService,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _funcoes: FuncoesService
  ) {}

  ngOnInit() {
    this.inicializarformUsuario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sigla && !changes.sigla.firstChange) {
      this.formUsuario.patchValue({ sigla: this.sigla });
    }
  }

  inicializarformUsuario() {
    this.formUsuario = this._fb.group({
      sigla: [this.sigla],
      login: ["", Validators.required],
      senha: ["", Validators.required],
      nome: ["", Validators.required],
      cpf: [""],
      email: ["", [Validators.required, Validators.email]],
      tipo: [""],
      fone: [""],
      user_login: [this._auth.getLogin()],
    });
  }

  public cadastrarUsuario() {
    this._funcoes.camposInvalidos(this.formUsuario);

    if (this.formUsuario.valid) {
      this._empresa.cadastrarUsuario(this.formUsuario.value).subscribe((res: RetornoModel) => {
          if (res && res.success === "true") {
            this._alert.success(res.msg);
          } else {
            this._alert.warning(res.msg);
          }
        },
        (error) => {
          this._alert.error( "Ocorreu um error ao tentar cadastrar o usuário." );
        }
      );
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }
}
