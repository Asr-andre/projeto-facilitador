import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TelefoneModel, TelefoneRetornoModel } from 'src/app/core/models/telefone.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { TelefoneService } from 'src/app/core/services/telefone.service';
import { EnvioSmsComponent } from './envio-sms/envio-sms.component';
import { WhatsappComponent } from './whatsapp/whatsapp.component';
import { FuncoesService } from 'src/app/core/services/funcoes.service';

@Component({
  selector: 'app-telefone',
  templateUrl: './telefone.component.html',
  styleUrl: './telefone.component.scss'
})
export class TelefoneComponent implements OnInit, OnChanges {
  @ViewChild(WhatsappComponent) whatsappComponent: WhatsappComponent;
  @ViewChild(EnvioSmsComponent) EnvioSmsComponent: EnvioSmsComponent;
  @Output() dadosEnviado: EventEmitter<void> = new EventEmitter<void>();
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  @Input() nomeCliente: string | undefined;
  public telefones: TelefoneRetornoModel;
  public loadingMin: boolean = false;
  public telefoneForm: FormGroup;
  public editar: boolean = false;

  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();

  constructor(private _telefoneService: TelefoneService,
    private _fb: FormBuilder,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _modal: NgbModal,
    private _funcoes: FuncoesService
  ) { }

  ngOnInit(): void {
    this.inicializarTelefoneForm();
    this.carregarTelefones(this.idCliente);
  }

  ngAfterViewInit() {
    if (this.EnvioSmsComponent) {
      this.EnvioSmsComponent.dadosEnviado.subscribe(() => {
        this.dadosEnviado.emit();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente && !changes.idCliente.firstChange) {
      this.carregarTelefones(this.idCliente);
    }
  }

  public inicializarTelefoneForm(dado?: TelefoneModel) {
    this.telefoneForm = this._fb.group({
      id_cliente: this.idCliente,
      id_empresa: [this.idEmpresa],
      fone: [dado?.fone ||'', Validators.required],
      tipo: [dado?.tipo || '', Validators.required],
      prioritario: [dado?.prioritario || '', Validators.required],
      status_fone: [dado?.status_fone || '', Validators.required],
      whatsapp: [dado?.whatsapp || '', Validators.required],
      obs_fone: [dado?.obs_fone || 'Cadastro'],
      user_login: [this.login]
    });
  }

  public controleBotao() {
    if (this.telefoneForm.invalid) {
      this._funcoes.camposInvalidos(this.telefoneForm);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    if(this.editar == false) {
      this.cadastrarTelefone();
    } else {
      this.editarTelefone();
    }
  }

  public carregarTelefones(idCliente: number): void {
    if (!idCliente) return;

    this.loadingMin = true;
    this._telefoneService.obterTelefonesPorCliente(idCliente).subscribe((telefones) => {
      this.telefones = telefones;
      this.loadingMin = false;
    },
      (error) => {
        this._alert.warning('Erro ao carregar telefones:', error);
        this.loadingMin = false;
      }
    );
  }

  public tipoTelefone(tipo: number): string {
    switch (tipo) {
      case 1: return 'Fixo Residencial';
      case 2: return 'Fixo Comercial';
      case 3: return 'Fixo Trabalho';
      case 4: return 'Fixo Referencia';
      case 5: return 'Fixo Vizinho';
      case 6: return 'Fixo Avalista';
      case 7: return 'Celular Pessoal';
      case 8: return 'Celular Comercial';
      case 9: return 'Celular Trabalho';
      case 10: return 'Celular Referencia';
      case 11: return 'Celular Vizinho';
      case 12: return 'Celular Avalista';
      case 13: return 'Celular Conjuge';
      case 14: return 'Outros';
      default: return 'Desconhecido';
    }
  }

  public statusTelefone(status: string): string {
    switch (status) {
      case 'A': return 'Ativo';
      case 'P': return 'Positivo';
      case 'N': return 'Negativo';
      default: return status;
    }
  }

  public abriModalTelefone(content: TemplateRef<any>): void {
    this.editar = false;
    this.inicializarTelefoneForm();
    this._modal.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public abriModalEditar(content: TemplateRef<any>, dados: TelefoneModel): void {
    this.editar = true;
    this.inicializarTelefoneForm(dados);
    this._modal.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarTelefone(): void {
    if (this.telefoneForm.valid) {
      this.loadingMin = true;
      this._telefoneService.cadastrarTelefone(this.telefoneForm.value).subscribe((res) => {
        if (res.success === 'true') {
          this.carregarTelefones(this.idCliente);
         this.fechar();
          this._alert.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alert.error('Ocorreu um erro ao tentar cadastrar o telefone.');
        }
      );
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public editarTelefone(): void {
    if (this.telefoneForm.valid) {
      this.loadingMin = true;
      this._telefoneService.editarTelefone(this.telefoneForm.value).subscribe((res) => {
        if (res.success === 'true') {
          this.carregarTelefones(this.idCliente);
         this.fechar();
          this._alert.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alert.error('Ocorreu um erro ao tentar atualizar o telefone.');
        }
      );
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public abrirWhatsappModal(telefone: string): void {
    this.whatsappComponent.abrirModalWhatsapp(telefone);
  }

  public abrirSmsModal(sms: string): void {
    this.EnvioSmsComponent.abrirModalSms(sms, this.idCliente, this.idContratante);
  }

  public fechar() {
    this.telefoneForm.reset();
    this._modal.dismissAll();
  }
}
