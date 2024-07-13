import { Component, OnInit } from "@angular/core";
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
  public exibirTelaCadastroCliente: boolean = false;
  public exibirTelaCadastroTitulos: boolean = false;
  public idEmpresa: number;
  public idContratante: number;
  public idCliente: number;
  public loading: boolean;


  constructor(
    private _contratanteService: ContratanteService,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.idEmpresa = Number(this._authenticationService.getIdEmpresa());
    this.obterContratantes(this.idEmpresa);
  }

  public obterContratantes(idEmpresa: number) {
    this.loading = true;
    this._contratanteService.obterContratantePorEmpresa(idEmpresa).subscribe((res) => {
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
    this.idContratante = this.contratanteSelecionado;
    this.exibirTelaCadastroCliente = true;
  }

  public onClienteImportado(idCliente: number): void {
    this.idCliente = idCliente;
    this.exibirTelaCadastroTitulos = true;
  }
}

