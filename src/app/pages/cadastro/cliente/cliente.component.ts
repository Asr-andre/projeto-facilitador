import { DatePipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdenarPeloHeaderTabela } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { Utils } from 'src/app/core/helpers/utils';
import { Cliente, ClienteModel} from 'src/app/core/models/cadastro/cliente.model';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { CepModel } from 'src/app/core/models/cep.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ClienteService } from 'src/app/core/services/cadastro/cliente.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { ConsultaCepService } from 'src/app/core/services/consulta.cep.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent {
  public listarDevedor: Cliente[] = [];
  public devedorSelecionado: Cliente | null = null;
  public contratantes: ContratanteModel [] = [];
  public loading: boolean = false;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._auth.getCurrentUser() || 0);
  public login = this._auth.getLogin();
  public mostrarTabela: Boolean = false;
  public mostrarCardCliente: Boolean = false;
  public mostrarCardTitulo: Boolean = false;
  public idCliente: Number;
  public formCliente: FormGroup;
  public title: string = '';
  public editar: boolean = true;
  public cep = new CepModel();

  public paginaAtual: number = 1;
  public itensPorPagina: number = 3;
  public dadosFiltrados: Cliente[] = [];
  public textoPesquisa: string = "";
  public totalRegistros: number = 0;
  public totalRegistrosExibidos: number = 0;
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<Cliente>>;

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
    private _retornoCep: ConsultaCepService,
    private _cliente: ClienteService,
    private _contratanteService: ContratanteService,
    private _auth: AuthenticationService,
    private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.obterContratantes();
    this.inicializarFormCliente();
  }

  public inicializarFormCliente(dado?: ClienteModel) {
    this.formCliente = this._formBuilder.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [dado?.id_contratante || ''],
      id_cliente: [dado?.id_cliente || 0],
      identificador: [dado?.identificador || ''],
      nome: [dado?.nome || ''],
      tipo_pessoa: [dado?.tipo_pessoa || ''],
      cnpj_cpf: [{ value: dado?.cnpj_cpf || '', disabled: this.editar }, [Validators.required]],
      rg: [dado?.rg || ''],
      orgao_expedidor: [dado?.orgao_expedidor || ''],
      endereco: [dado?.endereco || ''],
      numero: [dado?.numero || ''],
      complemento: [dado?.complemento || ''],
      bairro: [dado?.bairro || ''],
      cidade: [dado?.cidade || ''],
      uf: [dado?.uf || ''],
      cep: [dado?.cep || ''],
      pai: [dado?.pai || ''],
      mae: [dado?.mae || ''],
      sexo: [dado?.sexo || ''],
      conjuge: [dado?.conjuge || ''],
      trabalho: [dado?.trabalho || ''],
      cargo: [dado?.cargo || ''],
      valor_renda: [dado?.valor_renda || 0],
      melhor_canal_localizacao: [dado?.melhor_canal_localizacao || ''],
      fone_celular: [dado?.fone_celular || ''],
      fone_comercial: [dado?.fone_comercial || ''],
      fone_residencial: [dado?.fone_residencial || ''],
      email: [dado?.email || ''],
      user_login: [this.login],
      data_nascimento: [dado?.data_nascimento || '']
    });
}


  public selecionarDevedor(devedor: Cliente): void {
    this.mostrarCardCliente = true;
    this.title = "Atualizar Dados do Cliente"
    this.devedorSelecionado = devedor;
    this.inicializarFormCliente(devedor)
    this.editar = true;
  }

  public atualizarQuantidadeExibida() {
    this.totalRegistrosExibidos = Math.min(
      this.paginaAtual * this.itensPorPagina,
      this.totalRegistros
    );
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

  public salvarCliente() {
    this.formCliente.get('cnpj_cpf')?.enable();

  if (this.formCliente.invalid) {
    this._alertService.warning('Por favor, corrija os erros no formulário antes de continuar.');
    return;
  }

    this.formCliente.getRawValue();
    if (this.editar == true) {
      this.editarCliente();
    } else {
      this.cadastrarCliente();
    }
  }

  public abilitarCadastro() {
    this.editar = false;
    this.mostrarCardCliente = true;
    this.title = "Cadastrar Dados do Cliente"
    this.inicializarFormCliente();
  }

  public cadastrarCliente() {
    if (this.formCliente.invalid) {
      this._alertService.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

      const dadosParaEnvio = { ...this.formCliente.value };
      dadosParaEnvio.vencimento = this._datePipe.transform(dadosParaEnvio.data_nascimento, "dd/MM/yyyy");

    this.loading = true;

    this._cliente.cadastrarCliente(dadosParaEnvio).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success === 'true') {
          this._alertService.success(res.msg);
          this.cancela();
        } else {
          this._alertService.warning(res.msg);
        }
      },
      error: (err) => {
        this.loading = false;
        this._alertService.error('Ocorreu um erro ao tentar cadastrar o cliente:', err);
      }
    });
  }

  public editarCliente(): void {
    if (this.formCliente.invalid) {
      this._alertService.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    const dadosParaEnvio = { ...this.formCliente.value };
      dadosParaEnvio.vencimento = this._datePipe.transform(dadosParaEnvio.data_nascimento, "dd/MM/yyyy");

    this.loading = true;

    // Envia os dados do formulário se for válido
    this._cliente.editarCliente(dadosParaEnvio).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success === 'true') {
          this._alertService.success(res.msg);
        } else {
          this._alertService.warning(res.msg);
        }
      },
      error: (err) => {
        this.loading = false;
        this._alertService.error('Ocorreu um erro ao tentar editar o cliente:', err);
      }
    });
  }


  pesquisaClientes(): void {
    if (!this.textoPesquisa.trim()) {
      this._alertService.warning('Por favor, insira um cpf para a pesquisa o cliente.');
      return;
    }

    const texto = this.textoPesquisa.replace(/[.\-\/]/g, '').trim();

    this.loading = true;

    this._cliente.pesquisarCliente(texto).subscribe({
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
        this._alertService.error('Erro ao pesquisar clientes:', err);
        this.loading = false;
      }
    });
  }

  public cancela() {
    this.mostrarCardCliente = false;
    this.mostrarTabela =false;
    this.formCliente.reset();
    this.editar = true;
  }

  public viaCep(cep: string): void {
    if (cep) {
      this._retornoCep.consultarCep(cep)
        .then((cepResponse: CepModel | null) => {
          if (cepResponse) {
            this.cep = cepResponse; // Atualiza o objeto CEP
          } else {
            this.cep = null; // Define como null se não houver retorno
          }
        })
        .catch(() => {
          // Tratamento de erro (opcional)
          this.cep = null;
        });
    }
  }

  public mascararCpfCnpj(value: string): string {
    if (value) {
      return Utils.formatarDocumento(value);
    }
    return value;
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }

  public verificarValorNegativo(campo: string) {
    const valor = this.formCliente.get(campo)?.value;

    if (valor <= 0) {
      this.formCliente.get(campo)?.setValue(0);
    }
  }
}
