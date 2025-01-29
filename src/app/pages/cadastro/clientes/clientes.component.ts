import { Component } from '@angular/core';
import { Cliente, Titulo } from 'src/app/core/models/cadastro/cliente.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ClienteService } from 'src/app/core/services/cadastro/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent {
  public listarCliente: Cliente[] = [];
  public listarTitulos: any[] = [];
  public clienteSelecionado: Cliente | null = null;
  public tituloSelecionado: any[] = [];
  public titulo: any | null = null;
  public textoPesquisa: string = "";
  public campoInvalido: boolean = false;
  public loading: boolean = false;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._auth.getIdUsuario() || 0);
  public login = this._auth.getLogin();

  public cadastrarCliente: boolean = false;
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
      this._alert.warning('Por favor, insira um cpf ou nome para a pesquisa o cliente.');
      return;
    }

    const texto = this.textoPesquisa.replace(/[.\-\/]/g, '').trim();
    const dados = {
      id_empresa: this.idEmpresa,
      user_login: this.login,
      nome: '',
      cnpj_cpf: ''
    };

    if (isNaN(Number(texto))) {
      dados.nome = texto;
      this.tituloSelecionado = []
    } else {
      dados.cnpj_cpf = texto;
    }

    this.loading = true;

    this._cliente.pesquisarCliente(dados).subscribe({
      next: (res) => {
        if (res.success === 'true' && res.cliente && res.cliente.length > 0) {
          this.listarCliente = res.cliente || [];
          this.dadosFiltrados = res.cliente || [];
          this.listarTitulos = res.titulos || [];

          //this.tituloSelecionado = this.listarTitulos.filter(
          //  (titulo: Titulo) => this.listarCliente.some(cliente => cliente.id_cliente === titulo.id_cliente)
          //);

          this.appListaCliente = true;
          this.atualizarQuantidadeExibida();
          this.dadosFiltrados.sort((a, b) => {
            if (a.id_contratante < b.id_contratante) return 1;
            if (a.id_contratante > b.id_contratante) return -1;
            return 0;
          })
        } else {
          this.appListaCliente = false;
          this.listarCliente = [];
          this._alert.warning("Cliente não localizado")
        }
        this.loading = false;
      },
      error: (err) => {
        this._alert.error('Erro ao pesquisar clientes:', err);
        this.loading = false;
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

  public cadastrar() {
    this.cadastrarCliente = true;
    this.appPesquisar = false;
    this.appListaCliente = false
  }

  public fecharCadastro() {
    this.cadastrarCliente = false;
    this.appPesquisar = true;
  }
}
