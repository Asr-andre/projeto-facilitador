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
    private _empresaService: EmpresaService,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService
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
      user_login: [this._authenticationService.getLogin()],
    });
  }

  public cadastrarContratante() {
    this.marcarCamposComoTocados(this.formContratante);

    if (this.formContratante.valid) {
      this._empresaService.cadastrarContratante(this.formContratante.value).subscribe((res: RetornoModel) => {
            if (res && res.success === "true") {
              this._alertService.success(res.msg);
            } else {
              this._alertService.warning(res.msg);
            }
          },
          (error) => {
            this._alertService.error("Ocorreu um error ao tentar cadastrar o contratante.");
          }
        );
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  private marcarCamposComoTocados(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      const controle = formGroup.get(campo);
      controle?.markAsTouched();
      controle?.updateValueAndValidity();
    });
  }
}
