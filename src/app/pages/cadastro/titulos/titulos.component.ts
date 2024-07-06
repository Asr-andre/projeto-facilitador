import { Component, OnInit } from "@angular/core";
import { ContratanteModel } from "src/app/core/models/cadastro/contratante.model";
import { AlertService } from "src/app/core/services/alert.service";
import { ContratanteService } from "src/app/core/services/cadastro/contratante.service";

@Component({
  selector: "app-titulos",
  templateUrl: "./titulos.component.html",
  styleUrls: ["./titulos.component.scss"],
})
export class TitulosComponent implements OnInit {
  public listarContratantes: ContratanteModel [] = [];
  public contratanteSelecionado: number;
  public exibirTelaCadastroCliente: boolean = true;
  public exibirTelaCadastroTitulos: boolean = true;
  public idContratante: number;
  public idCliente: number;
  public loading: boolean;


  constructor(
    private _contratanteService: ContratanteService,
    private _alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.obterContratantes();
  }

  public obterContratantes() {
    this.loading = true;
    this._contratanteService.obterContratantePorEmpresa().subscribe((res) => {
        this.listarContratantes = res;
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

  }

  public onClienteImportado(idCliente: number): void {
    console.log('Recebido idCliente no método:', idCliente);
    this.idCliente = idCliente;

  }
}

