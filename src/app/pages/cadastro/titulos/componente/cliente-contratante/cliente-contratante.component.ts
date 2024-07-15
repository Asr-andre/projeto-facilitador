import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ClienteModel } from 'src/app/core/models/cadastro/cliente.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmpresaService } from 'src/app/core/services/cadastro/empresa.service';

@Component({
  selector: 'app-cliente-contratante',
  templateUrl: './cliente-contratante.component.html',
  styleUrls: ['./cliente-contratante.component.scss']
})
export class ClienteContratanteComponent {

  @Input() idContratante: string;
  @Output() idCliente = new EventEmitter<number>();
  public cliente: ClienteModel = new ClienteModel();
  @ViewChild("tabelaClientes") tabelaClientes: any;
  public loading: boolean = false;

  constructor(
    private servicoEmpresa: EmpresaService,
    private _authService: AuthenticationService,
    private _alertService: AlertService
  ) {}

  public importarCliente(): void {
    this.loading = true;
    const linha = this.tabelaClientes.nativeElement.querySelector('tbody tr');

    if (linha) {
      this.cliente.id_empresa = Number(this._authService.getIdEmpresa());
      this.cliente.id_contratante = Number(this.idContratante);
      this.cliente.cnpj_cpf = linha.querySelector('.cnpj_cpf').textContent.trim();
      this.cliente.nome = linha.querySelector('.nome').textContent.trim();
      this.cliente.endereco = linha.querySelector('.endereco').textContent.trim();
      this.cliente.numero = linha.querySelector('.numero').textContent.trim();
      this.cliente.bairro = linha.querySelector('.bairro').textContent.trim();
      this.cliente.cidade = linha.querySelector('.cidade').textContent.trim();
      this.cliente.uf = linha.querySelector('.uf').textContent.trim();
      this.cliente.cep = linha.querySelector('.cep').textContent.trim();
      this.cliente.user_login = this._authService.getLogin();

      if (this.clientePreenchido(this.cliente)) {
        this.servicoEmpresa.importarClientes(this.cliente).subscribe((res) => {
            if (res && res.success === 'true') {
              this.loading = false;
              this.idCliente.emit(Number(res.id_cliente));
              this._alertService.success(res.msg);
            } else if (res && res.success === 'false') {
              this.loading = false;
              this._alertService.warning(res.msg);
            }
          },
          (error) => {
            if (error.error && error.error.msg) {
              this.loading = false;
              this._alertService.error(error.error.msg);
            } else {
              this.loading = false;
              this._alertService.error("Erro ao importar cliente.");
            }
          }
        );
      } else {
        this._alertService.error("Cliente não está completamente preenchido.");
      }
    } else {
      this._alertService.warning("Nenhuma linha encontrada na tabela.");
    }
  }

  private clientePreenchido(cliente: ClienteModel): boolean {
    return !!(
      cliente.id_empresa &&
      cliente.id_contratante &&
      cliente.cnpj_cpf &&
      cliente.nome &&
      cliente.endereco &&
      cliente.numero &&
      cliente.bairro &&
      cliente.cidade &&
      cliente.uf &&
      cliente.cep &&
      cliente.user_login
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

  public limitarCaracteres(event: any, limite: number) {
    const elemento = event.target;
    if (elemento.textContent.length > limite) {
      elemento.textContent = elemento.textContent.slice(0, limite);
    }
  }
}
