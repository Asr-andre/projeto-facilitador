import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrdenarPeloHeaderTabela, SortEvent, compararParaOrdenar } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { Cliente, ClienteModel } from 'src/app/core/models/cadastro/cliente.model';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { DevedorModel, RespostaDevedorModel } from 'src/app/core/models/devedor.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ClienteService } from 'src/app/core/services/cadastro/cliente.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { EmpresaService } from 'src/app/core/services/cadastro/empresa.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent {
  public listarDevedores: DevedorModel[] = [];
  public listarDevedor: Cliente[] = [];
  public devedorSelecionado: DevedorModel | null = null;
  public contratantes: ContratanteModel [] = [];
  public loading: boolean = false;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._auth.getCurrentUser() || 0);
  public login = this._auth.getLogin();
  public mostrarTabela: Boolean = false;
  public mostrarForm: Boolean = false;
  public idCliente: Number;
  public formCliente: FormGroup;

  public paginaAtual: number = 1;
  public itensPorPagina: number = 3;
  public dadosFiltrados: DevedorModel[] = [];
  public textoPesquisa: string = "";
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<DevedorModel>>;

  public qtdeEmail: number = 0;
  public totalEmail: number = 0;
  public qtdeSms: number = 0;
  public totalSms: number = 0;
  public qtdeWhatsapp: number = 0;
  public totalWhatsapp: number = 0;
  public totalUtilizado: number = 0;
  public saldo: number = 0;

  public tipoPesquisa: string = "nome";
  public mostrarSemDivida: boolean = false;

  constructor(
    private _cliente: ClienteService,
    private _dashboard: DashboardService,
    private _contratanteService: ContratanteService,
    private _auth: AuthenticationService,
    private _formBuilder: FormBuilder,
    private _servicoEmpresa: EmpresaService,
    private _alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.obterContratantes();
    this.inicializarFormCliente();
  }

  public inicializarFormCliente(dado?: ClienteModel) {
    this.formCliente = this._formBuilder.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [dado?.id_contratante || ''],
      cnpj_cpf: [dado?.cnpj_cpf || ''],
      rg: [dado?.rg || ''],
      nome: [dado?.nome || ''],
      endereco: [dado?.endereco || ''],
      numero: [dado?.numero || ''],
      complemento: [dado?.complemento || ''],
      bairro: [dado?.bairro || ''],
      cidade: [dado?.cidade || ''],
      uf: [dado?.uf || ''],
      cep: [dado?.cep || ''],
      fone_celular: [dado?.fone_celular || ''],
      fone_comercial: [dado?.fone_comercial || ''],
      fone_residencial: [dado?.fone_residencial || ''],
      user_login: [this.login]
    })
  }

  public pesquisaCliente(): void {
    const filtros = this.construirFiltros(0);
    this.obterDevedores(filtros);
  }

  private construirFiltros(idFila: number): any {
    return {
        id_empresa: this.idEmpresa,
        id_fila: idFila,
        id_usuario: this.idUsuario,
        nome: this.tipoPesquisa === "nome" ? this.textoPesquisa : "",
        cnpj_cpf: this.tipoPesquisa === "cpf" ? this.textoPesquisa : "",
        mostrar_cliente_sem_dividas: this.mostrarSemDivida ? "S" : "N",
    };
  }

  public obterDevedores(filtros: any): void {
    this.loading = true;

    this._dashboard.obterDevedores(filtros).subscribe((res: RespostaDevedorModel) => {
      if (res && res.success === "true") {
        this.listarDevedores = res.clientes;
        this.dadosFiltrados = res.clientes;
        this.totalRegistros = this.dadosFiltrados.length;
        this.atualizarQuantidadeExibida();
        this.mostrarTabela = true;

        // Seleciona automaticamente o primeiro devedor, da fila
        if (this.listarDevedores.length > 0) {
          this.selecionarDevedor(this.listarDevedores[0]);
      }

        this.loading = false;
      } else {
        this.loading = false;
        this._alertService.warning(res.msg);
      }
    });
  }

  public selecionarDevedor(devedor: DevedorModel): void {
    this.devedorSelecionado = devedor;
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(
      this.paginaAtual * this.itensPorPagina,
      this.totalRegistros
    );
  }

  public ordenar({ column, direction }: SortEvent<DevedorModel>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.listarDevedores;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public obterContratantes() {
    this._contratanteService.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.contratantes = res.contratantes;
    },
      (error) => {
        this._alertService.error('Ocorreu um erro ao obter os contratantes.');
      }
    );
  }

  public abilitarCadastro() {
    this.mostrarForm = true;
    console.log(this.mostrarForm);
  }

  public cadastrarCliente() {

    this._servicoEmpresa.importarClientes(this.formCliente.value).subscribe((res) => {
      if (res.success === 'true') {

        this.idCliente = res.id_cliente;
        this._alertService.success(res.msg);
      } else  {
        this.loading = false;
        this._alertService.warning(res.msg);
      }
    });
  }

  pesquisaClientes(): void {
    if (!this.textoPesquisa.trim()) {
      this._alertService.warning('Por favor, insira um texto para a pesquisa.');
      return;
    }

    this.loading = true;

    this._cliente.pesquisarCliente(this.textoPesquisa.trim()).subscribe({
      next: (res) => {
        if (res.success === 'true') {
          this.listarDevedor = res.cliente || [];
          this.mostrarTabela = true;
        } else {
          this._alertService.warning(res.msg);
          this.listarDevedor = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao pesquisar clientes:', err);
        this._alertService.error('Erro ao buscar clientes. Tente novamente mais tarde.');
        this.loading = false;
      }
    });
  }

}
