import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente, ClienteModel } from 'src/app/core/models/cadastro/cliente.model';
import { ContratanteModel } from 'src/app/core/models/cadastro/contratante.model';
import { CepModel } from 'src/app/core/models/cep.model';
import { TipoTituloModel } from 'src/app/core/models/tipo.titulo.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ClienteService } from 'src/app/core/services/cadastro/cliente.service';
import { ContratanteService } from 'src/app/core/services/cadastro/contratante.service';
import { ConsultaCepService } from 'src/app/core/services/consulta.cep.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';
import { TipoTituloService } from 'src/app/core/services/tipo.titulo.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.scss'
})
export class EditarComponent implements OnInit {
  @Output() fecharEditar = new EventEmitter<void>();
  @Output() clienteAtualizado = new EventEmitter<string>();
  @Input() dadosCliente: Cliente | null = null;
  public listarCliente: Cliente[] = [];
  public clienteSelecionado: Cliente | null = null;
  public contratantes: ContratanteModel[] = [];
  public loading: boolean = false;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._auth.getIdUsuario() || 0);
  public login = this._auth.getLogin();
  public formCliente: FormGroup;
  public cep = new CepModel();
  public loadingMin: boolean = false;
  public ativaAba: number = 1;
  public editar: boolean = true;

  public tipoTitulo: TipoTituloModel;
  public formTitulo: FormGroup;


  constructor(
    private _retornoCep: ConsultaCepService,
    private _cliente: ClienteService,
    private _contratante: ContratanteService,
    private _auth: AuthenticationService,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _datePipe: DatePipe,
    private _funcoes: FuncoesService,
    private _tipoTitulo: TipoTituloService,
    private _fbT: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.obterContratantes();
    this.inicializarFormCliente(this.dadosCliente);
    this.inicializarformTitulo();
  }

  public inicializarFormCliente(dado?: ClienteModel) {
    this.formCliente = this._fb.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [dado?.id_contratante || '', [Validators.required]],
      id_cliente: [dado?.id_cliente || 0],
      identificador: [dado?.identificador || ''],
      nome: [dado?.nome || ''],
      tipo_pessoa: [dado?.tipo_pessoa || ''],
      cnpj_cpf: [dado?.cnpj_cpf || '', [Validators.required]],
      rg: [dado?.rg || ''],
      orgao_expedidor: [dado?.orgao_expedidor || ''],
      endereco: [dado?.endereco || ''],
      numero: [dado?.numero || ''],
      complemento: [dado?.complemento || ''],
      bairro: [dado?.bairro || ''],
      cidade: [dado?.cidade || ''],
      uf: [dado?.uf || ''],
      cep: [dado?.cep || '', [Validators.required]],
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
      data_nascimento: [
        dado?.data_nascimento
          ? new Date(dado.data_nascimento).toISOString().split('T')[0]
          : ''
      ]
    });
  }

  public inicializarformTitulo() {
    this.formTitulo = this._fbT.group({
      tipo_titulo: ["", Validators.required],
      parcela: ["", Validators.required],
      plano: ["", Validators.required],
      numero_contrato: ["", Validators.required],
      numero_documento: ["", Validators.required],
      vencimento: ["", Validators.required],
      produto: ["", Validators.required],
      valor: ["", Validators.required],
      id_contratante: [this.dadosCliente.id_contratante],
      id_empresa: [this.idEmpresa],
      id_cliente: [this.dadosCliente.id_cliente],
      user_login: [this.login]
    });
  }

  public ativarAba() {
    this.ativaAba = 1;
  }

  public ativaAba2() {
    this.ativaAba = 2;
    this.obterTipoTitulo();
  }

  public obterTipoTitulo() {
    this._tipoTitulo.obterTipoTitulo().subscribe((res) => {
      if (res) {
        this.tipoTitulo = res;
      }
    });
  }

  public obterContratantes() {
    this._contratante.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.contratantes = res.contratantes;
    },
      (error) => {
        this._alert.error('Ocorreu um erro ao obter os contratantes.');
      }
    );
  }

  public editarCliente(): void {
    if (this.formCliente.invalid) {
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    const dadosParaEnvio = { ...this.formCliente.value };
    dadosParaEnvio.data_nascimento = this._datePipe.transform(dadosParaEnvio.data_nascimento, "dd/MM/yyyy");
    dadosParaEnvio.cnpj_cpf = dadosParaEnvio.cnpj_cpf.replace(/[.\-\/]/g, '').trim();

    this.loading = true;

    this._cliente.editarCliente(dadosParaEnvio).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success === 'true') {
          this.clienteAtualizado.emit(this.formCliente.get('cnpj_cpf')?.value);
          this.ativaAba2();
          this._alert.success(res.msg);
        } else {
          this._alert.warning(res.msg);
        }
      },
      error: (err) => {
        this.loading = false;
        this._alert.error('Ocorreu um erro ao tentar editar o cliente:', err);
      }
    });
  }

  public verificarValorNegativo(campo: string) {
    const valor = this.formTitulo.get(campo)?.value;

    if (valor <= 0) {
      this.formTitulo.get(campo)?.setValue(0);
    }
  }

  public cadastrarTitulo(): void {
    if (!this.formTitulo.valid) {
      this._funcoes.camposInvalidos(this.formTitulo);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    const dadosTitulo = {
      ...this.formTitulo.value,
      vencimento: this._datePipe.transform(this.formTitulo.value.vencimento, 'dd/MM/yyyy') || ''
    };

    this.loadingMin = true;

    this._cliente.cadastrarTitulos(dadosTitulo).subscribe((res) => {
      if (res.success) {
        this.loadingMin = false;
        this.clienteAtualizado.emit(this.formCliente.get('cnpj_cpf')?.value);
        this.fecharEditar.emit();
        this._alert.success(res.msg);
      } else {
        this.loadingMin = false;
        this._alert.warning(res.msg);
      }
    },
      (error) => {
        this.loadingMin = false;
        this._alert.error('Atenção Título Já Existente, Verifique os Campos Chaves!!!');
      }
    );
  }

  public viaCep(cep: string): void {
    if (cep) {
      this._retornoCep.consultarCep(cep).then((cepResponse: CepModel | null) => {
        if (cepResponse) {
          this.cep = cepResponse; // Atualiza o objeto CEP
        } else {
          this.cep = null;
        }
      }).catch(() => {
        this.cep = null;
      });
    }
  }

  public fechar() {
    this.formCliente.reset();
    this.formTitulo.reset()
    this.fecharEditar.emit();
  }
}
