import { Component, Input, ViewChild } from '@angular/core';
import { ClienteModel } from 'src/app/core/models/cadastro/cliente.model';
import { EmpresaService } from 'src/app/core/services/cadastro/empresa.service';

@Component({
  selector: 'app-cliente-contratante',
  templateUrl: './cliente-contratante.component.html',
  styleUrls: ['./cliente-contratante.component.scss']
})
export class ClienteContratanteComponent {

  @Input() idEmpresa: string;
  public clientes: ClienteModel[] = [];
  public clienteTemporario: ClienteModel = new ClienteModel();

  @ViewChild("tabelaClientes") tabelaClientes: any;

  constructor(private servicoEmpresa: EmpresaService) {}

  public importarClientes(): void {
    if (this.clientePreenchido()) {
      this.clientes.push(this.clienteTemporario);
      this.limparClienteTemporario();
    }

    if (this.clientes.length > 0) {
      this.servicoEmpresa.importarClientes(this.clientes).subscribe(
        (response) => {
          console.log("Clientes importados com sucesso!", response);
          this.clientes = [];
        },
        (error) => {
          console.error("Erro ao importar clientes", error);
        }
      );
    } else {
      console.error("Nenhum cliente para importar.");
    }
  }

  private clientePreenchido(): boolean {
    console.log('Cliente temporário:', this.clienteTemporario);
    return !!(
      this.clienteTemporario.cnpj_cpf &&
      this.clienteTemporario.nome &&
      this.clienteTemporario.endereco &&
      this.clienteTemporario.numero &&
      this.clienteTemporario.bairro &&
      this.clienteTemporario.cidade &&
      this.clienteTemporario.uf &&
      this.clienteTemporario.cep &&
      this.clienteTemporario.fone_prioritario &&
      this.clienteTemporario.fone_residencial
    );
  }

  private limparClienteTemporario(): void {
    this.clienteTemporario = new ClienteModel();
  }

  public colarDados(evento: ClipboardEvent): void {
    console.log('Evento de colar:', evento);
    evento.preventDefault();
    const dadosClipboard = evento.clipboardData;
    const textoColado = dadosClipboard.getData('text');
    const dadosLinha = textoColado.split('\t');

    console.log('Texto colado:', textoColado);
    console.log('Dados da linha:', dadosLinha);

    const linha = this.tabelaClientes.nativeElement.querySelector('tbody tr');

    if (linha) {
      const celulas = linha.querySelectorAll('td');

      dadosLinha.forEach((valor, indice) => {
        if (celulas[indice]) {
          celulas[indice].textContent = valor.trim();
        }
      });
    }
  }
}
