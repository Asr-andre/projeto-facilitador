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
  selector: "app-contratante",
  templateUrl: "./contratante.component.html",
  styleUrl: "./contratante.component.scss",
})
export class ContratanteComponent implements OnInit, OnChanges {
  @Input() idEmpresa: string;
  public formContratante: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _empresaService: EmpresaService,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService
  ) {}

  ngOnInit() {
    this.inicializarformEmpresa();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.idEmpresa && changes.idEmpresa.currentValue) {
      this.formContratante.patchValue({ id_empresa: this.idEmpresa });
    }
  }

  inicializarformEmpresa() {
    this.formContratante = this._formBuilder.group({
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
      user_login: [this._authenticationService.getLogin()],
    });
  }

  public cadastrarContratante() {
    if (this.formContratante.valid) {
      this._empresaService.cadastrarContratante(this.formContratante.value).subscribe((res: RetornoModel) => {
            if (res && res.success === "true") {
              this._alertService.success(res.msg);
            } else {
              this._alertService.warning(res.msg);
            }
          },
          (error) => {
            this._alertService.error("Ocorreu um erro ao tentar cadastrar a empresa.");
          }
        );
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }
}
