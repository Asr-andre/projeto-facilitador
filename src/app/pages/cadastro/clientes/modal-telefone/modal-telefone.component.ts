import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TelefoneRetornoModel, TelefoneModel } from 'src/app/core/models/telefone.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FuncoesService } from 'src/app/core/services/funcoes.service';
import { TelefoneService } from 'src/app/core/services/telefone.service';

@Component({
  selector: 'app-modal-telefone',
  templateUrl: './modal-telefone.component.html',
  styleUrl: './modal-telefone.component.scss'
})
export class ModalTelefoneComponent {
  @ViewChild('modalTelefone') modalTelefone: TemplateRef<any>;

  public idCliente: number | undefined;
  public telefones: TelefoneRetornoModel;
  public loadingMin: boolean = false;
  public telefoneForm: FormGroup;

  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();

  constructor(
    private _telefone: TelefoneService,
    private _fb: FormBuilder,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _modal: NgbModal,
    private _funcoes: FuncoesService
  ) { }

  ngOnInit(): void {
    this.inicializarTelefoneForm();
  }

  public inicializarTelefoneForm() {
    this.telefoneForm = this._fb.group({
      id_fone: [''],
      id_cliente: [this.idCliente],
      id_empresa: [this.idEmpresa],
      fone: ['', Validators.required],
      tipo: ['', Validators.required],
      prioritario: ['', Validators.required],
      status_fone: ['', Validators.required],
      whatsapp: ['', Validators.required],
      obs_fone: ['Cadastro'],
      user_login: [this.login]
    });
  }

  public abrirModalTelefone(telefone: any): void {
    this.idCliente = Number(telefone.id_cliente);
    this.inicializarTelefoneForm();
    this.carregarTelefones(this.idCliente);
    this._modal.open(this.modalTelefone, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public carregarTelefones(idCliente: number): void {
    if (!idCliente) return;

    this.loadingMin = true;
    this._telefone.obterTelefonesPorCliente(idCliente).subscribe((telefones) => {
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

  public cadastrarTelefone(): void {
    if (this.telefoneForm.invalid) {
      this._funcoes.camposInvalidos(this.telefoneForm);
      this._alert.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    if (this.telefoneForm.valid) {
      const dados = {
        ...this.telefoneForm.value,
        fone: this.telefoneForm.value.fone.replace(/\D/g, '')
      }

      this.loadingMin = true;
      this._telefone.cadastrarTelefone(dados).subscribe((res) => {
        if (res.success === 'true') {
          this.carregarTelefones(this.idCliente);
          this._alert.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alert.error('Ocorreu um erro ao tentar cadastrar o telefone.', error);
        }
      );
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public fechar() {
    this.telefoneForm.reset();
    this._modal.dismissAll();
  }
}
