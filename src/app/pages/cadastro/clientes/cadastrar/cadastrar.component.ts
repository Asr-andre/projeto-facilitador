import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Cliente } from 'src/app/core/models/cadastro/cliente.model';
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
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.scss'
})
export class CadastrarComponent implements OnInit  {
  @Output() fecharCadastro = new EventEmitter<void>();
  @Output() clienteCadastrado = new EventEmitter<string>();
  public listarCliente: Cliente[] = [];
  public clienteSelecionado: Cliente | null = null;
  public contratantes: ContratanteModel[] = [];
  public loading: boolean = false;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._auth.getIdUsuario() || 0);
  public login = this._auth.getLogin();
  public formCliente: FormGroup;
  public cep = new CepModel();
  public ativaAba: number = 1;

  public tipoTitulo: TipoTituloModel;
  public formTitulo: FormGroup;
  public idContratante: string = '';
  public idCliente: string = '';

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
    this.inicializarFormCliente();
    this.inicializarformTitulo();
  }

  public inicializarFormCliente() {
    this.formCliente = this._fb.group({
      id_empresa: [this.idEmpresa],
      id_contratante: ['', [Validators.required]],
      identificador: [''],
      nome: [''],
      tipo_pessoa: [''],
      cnpj_cpf: ['', [Validators.required]],
      rg: [''],
      orgao_expedidor: [''],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      uf: [''],
      cep: ['', [Validators.required]],
      pai: [''],
      mae: [''],
      sexo: [''],
      conjuge: [''],
      trabalho: [''],
      cargo: [''],
      valor_renda: [0],
      melhor_canal_localizacao: [''],
      fone_celular: [''],
      fone_comercial: [''],
      fone_residencial: [''],
      email: [''],
      user_login: [this.login],
      data_nascimento: ['']
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
      id_contratante: [this.idContratante],
      id_empresa: [this.idEmpresa],
      id_cliente: [this.idCliente],
      user_login: [this.login]
    });
  }

  public ativarAba() {
    this.ativaAba = 1;
  }

  public ativaAba2() {
    this.ativaAba = 2;
    this.obterTipoTitulo();
    this.idContratante = this.formCliente.get('id_contratante')?.value;
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

  public cadastrarCliente() {
    if (this.formCliente.invalid) {
      this._funcoes.camposInvalidos(this.formCliente);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    const dadosParaEnvio = { ...this.formCliente.value,
      data_nascimento: this._datePipe.transform(this.formCliente.value.data_nascimento, "dd/MM/yyyy"),
      cnpj_cpf: this.formCliente.value.cnpj_cpf.replace(/[.\-\/]/g, '').trim()
    };

    this.loading = true;
    this._cliente.cadastrarCliente(dadosParaEnvio).pipe(finalize(() => { this.loading = false; })).subscribe({
      next: (res) => {
        if (res.success === 'true') {
          this._alert.success(res.msg);
          this.ativaAba2();
          this.idCliente = res.id_cliente;
        } else {
          this._alert.warning(res.msg);
        }
      },
      error: (err) => {
        this._alert.error('Ocorreu um erro ao tentar cadastrar o cliente:', err);
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
      id_empresa: this.idEmpresa,
      id_cliente: this.idCliente,
      id_contratante: this.idContratante,
      vencimento: this._datePipe.transform(this.formTitulo.value.vencimento, 'dd/MM/yyyy') || ''
    };

    this.loading = true;
    this._cliente.cadastrarTitulos(dadosTitulo).pipe(finalize(() => { this.loading = false; })).subscribe({
      next: (res) => {
        if (res.success) {
          this.clienteCadastrado.emit(this.formCliente.get('cnpj_cpf')?.value);
          this.fecharCadastro.emit();
          this._alert.success(res.msg);
        } else {
          this._alert.warning(res.msg);
        }
      },
      error: (err) => {
        this._alert.error('Atenção ocorreu um erro ao tentar cadastrar o Título, Verifique os Campos Chaves!!!', err);
      }
    });
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
    this.idContratante = '';
    this.idCliente = '';
    this.fecharCadastro.emit();
  }
}
