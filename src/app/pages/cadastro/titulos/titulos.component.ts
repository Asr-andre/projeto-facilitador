import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ContratanteModel } from "src/app/core/models/cadastro/contratante.model";
import { AlertService } from "src/app/core/services/alert.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { ContratanteService } from "src/app/core/services/cadastro/contratante.service";

@Component({
  selector: "app-titulos",
  templateUrl: "./titulos.component.html",
  styleUrls: ["./titulos.component.scss"],
})
export class TitulosComponent implements OnInit {
  public contratantes: ContratanteModel [] = [];
  public contratanteSelecionado: number;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public exibirTelaCadastroCliente: boolean = true;
  public exibirTelaCadastroTitulos: boolean = true;
  public idContratante: number;
  public idCliente: number;
  public loading: boolean;
  public formPesquisa: FormGroup;


  constructor(
    private _contratanteService: ContratanteService,
    private _auth: AuthenticationService,
    private _alertService: AlertService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.obterContratantes();
    this.iniciarForm();
  }

  public iniciarForm() {
    this.formPesquisa = this._fb.group({
      id_cliente: [],
      id_contratante: ['',Validators.required]
    })
  }

  public obterContratantes() {
    this.loading = true;
    this._contratanteService.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.contratantes = res.contratantes;
      this.loading = false;
    },
      (error) => {
        this._alertService.error('Ocorreu um erro ao obter os contratantes.');
        this.loading = false;
      }
    );
  }

  public selecionarContratante(): void {
    if (this.formPesquisa.invalid) {
      this.marcarCamposComoTocados(this.formPesquisa);
      this._alertService.warning('Por favor, corrija os erros no formulário antes de continuar.');
      this.exibirTelaCadastroCliente = false;
      this.exibirTelaCadastroTitulos = false;
      return;
    }

    const dadosParaEnvio = { ...this.formPesquisa.value };
    this.idContratante =  dadosParaEnvio.id_contratante
    this.exibirTelaCadastroCliente = true;
  }

  private marcarCamposComoTocados(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      const controle = formGroup.get(campo);
      controle?.markAsTouched();
      controle?.updateValueAndValidity();
    });
  }

  public onClienteImportado(idCliente: number): void {
    this.idCliente = idCliente;
    this.exibirTelaCadastroTitulos = true;
  }
}

