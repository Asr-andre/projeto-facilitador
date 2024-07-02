import { Component, ElementRef, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import { EmpresaService } from "src/app/core/services/empresa.service";

@Component({
  selector: "app-titulos",
  templateUrl: "./titulos.component.html",
  styleUrls: ["./titulos.component.scss"],
})
export class TitulosComponent {
  public clientes: any[] = [];

  @ViewChild("tabelaClientes") tabelaClientes: ElementRef;

  constructor(private servicoEmpresa: EmpresaService) {
    this.clientes.push({ id: "", nome: "", email: "", telefone: "" });
  }

  public importarClientes() {
    this.servicoEmpresa.importarClientes(this.clientes).subscribe(
      (response) => {
        console.log("Clientes importados com sucesso!", response);
      },
      (error) => {
        console.error("Erro ao importar clientes", error);
      }
    );
  }

  public aoPressionarEnter(evento: KeyboardEvent, indiceLinha: number, indiceColuna: number) {
    if (evento.key === "Enter") {
      if (indiceColuna === 3 && indiceLinha === this.clientes.length - 1) {

        this.clientes.push({ id: "", nome: "", email: "", telefone: "" });

        setTimeout(() => {
          const elementoTabela = this.tabelaClientes.nativeElement as HTMLTableElement;
          const linhas = elementoTabela.rows;
          const novaLinha = linhas[linhas.length - 1];
          const primeiraCelula = novaLinha.cells[0] as HTMLElement;
          primeiraCelula.focus();
        });
      }
    }
  }
}
