import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TelefoneRetornoModel } from 'src/app/core/models/telefone.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { TelefoneService } from 'src/app/core/services/telefone.service';
import { EnvioSmsComponent } from './envio-sms/envio-sms.component';
import { WhatsappComponent } from './whatsapp/whatsapp.component';

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
  public telefones: TelefoneRetornoModel;
  public loadingMin: boolean = false;
  public telefoneForm: FormGroup;

  constructor(private _telefoneService: TelefoneService,
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService,
    private modalService: NgbModal
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

  public inicializarTelefoneForm() {
    this.telefoneForm = this._formBuilder.group({
      id_cliente: this.idCliente,
      fone: ['', Validators.required],
      tipo: ['', Validators.required],
      prioritario: ['', Validators.required],
      status_fone: ['', Validators.required],
      whatsapp: ['', Validators.required],
      obs_fone: ['Cadastro'],
      user_login: [this._authenticationService.getLogin()]
    });
  }

  public carregarTelefones(idCliente: number): void {
    this.loadingMin = true;
    this._telefoneService.obterTelefonesPorCliente(idCliente).subscribe((telefones) => {
      this.telefones = telefones;
      this.loadingMin = false;
    },
      (error) => {
        this._alertService.warning('Erro ao carregar telefones:', error);
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
      default: return 'Desconhecido';
    }
  }

  public abriModalTelefone(content: TemplateRef<any>): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarTelefone(modal: any): void {
    if (this.telefoneForm.valid) {
      this.loadingMin = true;
      this._telefoneService.cadastrarTelefone(this.telefoneForm.value).subscribe((res) => {
        if (res.success === 'true') {
          this.carregarTelefones(this.idCliente);
          modal.close();
          this._alertService.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error('Ocorreu um erro ao tentar cadastrar o telefone.');
        }
      );
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public abrirWhatsappModal(telefone: string): void {
    this.whatsappComponent.abrirModalWhatsapp(telefone);
  }

  public abrirSmsModal(sms: string): void {
    this.EnvioSmsComponent.abrirModalSms(sms, this.idCliente, this.idContratante);
  }
}
