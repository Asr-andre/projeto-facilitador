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
  selector: "app-contratante",
  templateUrl: "./contratante.component.html",
  styleUrl: "./contratante.component.scss",
})
export class ContratanteComponent implements OnInit, OnChanges {
  @Input() idEmpresa: string;
  public formContratante: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _empresa: EmpresaService,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _funcoes: FuncoesService
  ) {}

  ngOnInit() {
    this.inicializarformContratante();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.idEmpresa && changes.idEmpresa.currentValue) {
      this.formContratante.patchValue({ id_empresa: this.idEmpresa });
    }
  }

  inicializarformContratante() {
    this.formContratante = this._fb.group({
      id_empresa: [this.idEmpresa],
      cnpj: ["", Validators.required],
      razao_social: ["", Validators.required],
      fantasia: ["", Validators.required],
      endereco: [""],
      numero: [""],
      complemento: [""],
      bairro: [""],
      cidade: [""],
      uf: [""],
      user_login: [this._auth.getLogin()],
    });
  }

  public cadastrarContratante() {
    this._funcoes.camposInvalidos(this.formContratante);

    if (this.formContratante.valid) {
      this._empresa.cadastrarContratante(this.formContratante.value).subscribe((res: RetornoModel) => {
            if (res && res.success === "true") {
              this._alert.success(res.msg);
            } else {
              this._alert.warning(res.msg);
            }
          },
          (error) => {
            this._alert.error("Ocorreu um error ao tentar cadastrar o contratante.");
          }
        );
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }
}
