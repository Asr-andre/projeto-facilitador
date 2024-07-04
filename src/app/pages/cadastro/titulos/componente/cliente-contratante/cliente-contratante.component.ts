import { Component, Input, ViewChild } from '@angular/core';
import { ClienteModel } from 'src/app/core/models/cadastro/cliente.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmpresaService } from 'src/app/core/services/cadastro/empresa.service';

@Component({
  selector: 'app-cliente-contratante',
  templateUrl: './cliente-contratante.component.html',
  styleUrls: ['./cliente-contratante.component.scss']
})
export class ClienteContratanteComponent {

  @Input() idContratante: string;
  public clientes: ClienteModel[] = [];
  @ViewChild("tabelaClientes") tabelaClientes: any;

  constructor(
    private servicoEmpresa: EmpresaService,
    private _authService: AuthenticationService) {}

  public importarClientes(): void {
    const linhas = this.tabelaClientes.nativeElement.querySelectorAll('tbody tr');
    this.clientes = [];

    linhas.forEach((linha, index) => {
      const cliente = new ClienteModel();
      cliente.id_empresa = Number(this._authService.getIdEmpresa());
      cliente.id_contratante = Number(this.idContratante);
      cliente.cnpj_cpf = linha.querySelector('.cnpj_cpf').textContent.trim();
      cliente.nome = linha.querySelector('.nome').textContent.trim();
      cliente.endereco = linha.querySelector('.endereco').textContent.trim();
      cliente.numero = linha.querySelector('.numero').textContent.trim();
      cliente.bairro = linha.querySelector('.bairro').textContent.trim();
      cliente.cidade = linha.querySelector('.cidade').textContent.trim();
      cliente.uf = linha.querySelector('.uf').textContent.trim();
      cliente.cep = linha.querySelector('.cep').textContent.trim();
      cliente.user_login = this._authService.getLogin();

      if (this.clientePreenchido(cliente)) {
        this.clientes.push(cliente);
      }
    });

    console.log('Array de clientes:', this.clientes);

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

  private clientePreenchido(cliente: ClienteModel): boolean {
    return !!(

      cliente.cnpj_cpf &&
      cliente.nome &&
      cliente.endereco &&
      cliente.numero &&
      cliente.bairro &&
      cliente.cidade &&
      cliente.uf &&
      cliente.cep
    );
  }

  public colarDados(evento: ClipboardEvent): void {
    evento.preventDefault();
    const dadosClipboard = evento.clipboardData;
    const textoColado = dadosClipboard.getData('text');
    const dadosLinha = textoColado.split('\t');

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
