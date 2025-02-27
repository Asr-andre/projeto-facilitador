import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ContratanteModel } from "src/app/core/models/cadastro/contratante.model";
import { AlertService } from "src/app/core/services/alert.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { ContratanteService } from "src/app/core/services/cadastro/contratante.service";
import { FuncoesService } from "src/app/core/services/funcoes.service";

@Component({
  selector: "app-titulos",
  templateUrl: "./titulos.component.html",
  styleUrls: ["./titulos.component.scss"],
})
export class TitulosComponent implements OnInit {
  public contratantes: ContratanteModel [] = [];
  public contratanteSelecionado: number;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public exibirTelaCadastroCliente: boolean = false;
  public exibirTelaCadastroTitulos: boolean = true;
  public idContratante: number;
  public idCliente: number;
  public loading: boolean;
  public formPesquisa: FormGroup;


  constructor(
    private _contratante: ContratanteService,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _fb: FormBuilder,
    private _funcoes: FuncoesService
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
    this._contratante.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.contratantes = res.contratantes;
      this.loading = false;
    },
      (error) => {
        this._alert.error('Ocorreu um erro ao obter os contratantes.');
        this.loading = false;
      }
    );
  }

  public selecionarContratante(): void {
    if (this.formPesquisa.invalid) {
      this._funcoes.camposInvalidos(this.formPesquisa);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      this.exibirTelaCadastroCliente = false;
      this.exibirTelaCadastroTitulos = false;
      return;
    }

    const dadosParaEnvio = { ...this.formPesquisa.value };
    this.idContratante =  dadosParaEnvio.id_contratante
    this.exibirTelaCadastroCliente = true;
  }

  public onClienteImportado(idCliente: number): void {
    this.idCliente = idCliente;
    this.exibirTelaCadastroTitulos = true;
  }
}

