import { Component, OnInit } from "@angular/core";
import { ContratanteModel } from "src/app/core/models/cadastro/contratante.model";
import { ContratanteService } from "src/app/core/services/cadastro/contratante.service";

@Component({
  selector: "app-titulos",
  templateUrl: "./titulos.component.html",
  styleUrls: ["./titulos.component.scss"],
})
export class TitulosComponent implements OnInit {
  public listarContratantes: ContratanteModel [] = [];
  public contratanteSelecionado: number;
  public idEmpresa: number;

  constructor(
    private _contratanteService: ContratanteService
  ) {}

  ngOnInit(): void {
    this.obterContratantes();
  }

  public obterContratantes() {
    this._contratanteService.obterContratantes().subscribe((res) => {
      this.listarContratantes = res
    });
  }

  public selecionarContratante(): void {
    this.idEmpresa = this.contratanteSelecionado;
  }
}

