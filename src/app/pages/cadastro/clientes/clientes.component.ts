import { Component, ViewChild} from '@angular/core';
import { finalize } from 'rxjs';
import { Cliente, Titulo } from 'src/app/core/models/cadastro/cliente.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ClienteService } from 'src/app/core/services/cadastro/cliente.service';
import { ModalTelefoneComponent } from './modal-telefone/modal-telefone.component';
import { ModalEmailComponent } from './modal-email/modal-email.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent {
  @ViewChild(ModalTelefoneComponent) ModalTelefoneComponent: ModalTelefoneComponent;
  @ViewChild(ModalEmailComponent) ModalEmailComponent: ModalEmailComponent;

  public clienteParaEdicao: Cliente | null = null;
  public listarCliente: Cliente[] = [];
  public clienteSelecionado: Cliente | null = null;
  public listarTitulos: Titulo[] = [];
  public tituloSelecionado: Titulo[] = [];
  public titulo: any | null = null;
  public textoPesquisa: string = "";
  public campoInvalido: boolean = false;
  public loading: boolean = false;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._auth.getIdUsuario() || 0);
  public login = this._auth.getLogin();

  public cadastrarCliente: boolean = false;
  public editarCliente: boolean = false;
  public appPesquisar: boolean = true;
  public appListaCliente: boolean = false;

  public paginaAtual: number = 1;
  public itensPorPagina: number = 5;
  public dadosFiltrados: Cliente[] = [];
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public qtdRegistrosPorPagina = [10, 25, 50, 100];

  constructor(
    private _cliente: ClienteService,
    private _auth: AuthenticationService,
    private _alert: AlertService,
  ) { }

  pesquisaClientes(cpfCnpj?: string): void {
    if (cpfCnpj) {
      this.textoPesquisa = cpfCnpj;
    }

    if (!this.textoPesquisa.trim()) {
      this.validarCampo();
      this._alert.warning('Por favor, insira um CPF ou nome para pesquisar o cliente.');
      return;
    }

    const texto = this.textoPesquisa.replace(/[.\-\/]/g, '').trim();
    const dados = {
      id_empresa: this.idEmpresa,
      user_login: this.login,
      nome: isNaN(Number(texto)) ? texto : '',
      cnpj_cpf: isNaN(Number(texto)) ? '' : texto
    };

    this.tituloSelecionado = []
    this.loading = true;
    this._cliente.pesquisarCliente(dados).pipe(finalize(() => { this.loading = false; })).subscribe({
      next: (res) => {
        if (res.success === 'true' && res.cliente && res.cliente.length > 0) {
          this.listarCliente = res.cliente;
          this.dadosFiltrados = res.cliente;
          this.listarTitulos = res.titulos;

          this.tituloSelecionado = this.listarTitulos.filter(
            (titulo: Titulo) => this.listarCliente.some(cliente => cliente.id_cliente === titulo.id_cliente)
          );

          this.appListaCliente = true;
          this.atualizarQuantidadeExibida();
          this.dadosFiltrados.sort((a, b) => b.id_contratante - a.id_contratante);
        } else {
          this.appListaCliente = false;
          this.listarCliente;
          this._alert.warning("Cliente não localizado")
        }
      },
      error: (err) => {
        this._alert.error('Erro ao pesquisar clientes:', err);
      }
    });
  }

  public selecionarcliente(cliente: Cliente): void {
    this.clienteSelecionado = cliente;

    this.tituloSelecionado = this.listarTitulos.filter(
      (titulo: Titulo) => titulo.id_cliente === cliente.id_cliente
    );
  }

  public validarCampo() {
    this.campoInvalido = !this.textoPesquisa || this.textoPesquisa.trim().length === 0;
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(this.paginaAtual * this.itensPorPagina, this.totalRegistros);
  }

  public modalTelefone(telefone: string): void {
    if (this.ModalTelefoneComponent) {
      this.ModalTelefoneComponent.abrirModalTelefone(telefone);
    } else {
      console.error('ModalTelefoneComponent ainda não foi inicializado.');
    }
  }

  public modalEmail(email: string): void {
    console.log('email', email);
    if (this.ModalEmailComponent) {
      this.ModalEmailComponent.abrirModalEmail(email);
    } else {
      console.error('ModalEmailComponent ainda não foi inicializado.');
    }
  }

  public cadastrar() {
    this.cadastrarCliente = true;
    this.appPesquisar = false;
    this.appListaCliente = false
  }

  public fecharCadastro() {
    this.cadastrarCliente = false;
    this.appPesquisar = true;
  }

  public editar(cliente: Cliente) {
    this.editarCliente = true;
    this.appPesquisar = false;
    this.appListaCliente = false
    this.clienteParaEdicao = cliente;
  }

  public fecharEditar() {
    this.editarCliente = false;
    this.appPesquisar = true;
  }
}
