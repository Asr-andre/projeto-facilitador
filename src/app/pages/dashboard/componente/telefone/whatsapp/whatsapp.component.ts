import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { WhatsappService } from 'src/app/core/services/whatsapp.service';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss']
})
export class WhatsappComponent implements OnInit {
  @ViewChild('whatsappModal') whatsappModal: TemplateRef<any>;
  public abrirModal = false;
  public telefoneCliente: string;
  public whatsappForm: FormGroup;
  @Input() idCliente: number | undefined;
  @Input() nomeCliente: string | undefined;

  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();
  public centrocusto = '66bba84b2e0f90a2984941c6';
  public callbackRetorno = 'http://portal.facilitadorsistemas.com.br:3000/retornobestmessage';

  constructor(
    private fb: FormBuilder,
    private _whatsappService: WhatsappService,
    private _auth: AuthenticationService,
    private _modalService: NgbModal,
    private _alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.inicializarwhatsappForm();
  }

  public inicializarwhatsappForm() {
    this.whatsappForm = this.fb.group({
      id_empresa: [this.idEmpresa, Validators.required],
      centrocusto: [this.centrocusto, Validators.required],
      user_login: [this.login, Validators.required],
      whats: this.fb.array([
        this.fb.group({
          numero: [this.telefoneCliente, Validators.required],
          mensagem: ['', Validators.required],
          idCustom: [this.idEmpresa, Validators.required],
          cpf: [this.nomeCliente, Validators.required],
          contrato: [this.idCliente, Validators.required],
          callbackRetorno: [this.callbackRetorno, Validators.required]
        })
      ])
    });
  }

  public abrirModalWhatsapp(telefone: string): void {
    if (telefone) {
      this.telefoneCliente = this.limparNumero(telefone);
      this.inicializarwhatsappForm();
      this.abrirModal = true;
      this._modalService.open(this.whatsappModal, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    } else {
      this._alertService.warning('Selecione o cliente  para obter o número de telefone.');
    }
  }

  public enviarMensagem(): void {
    if (this.whatsappForm.valid) {
      this._whatsappService.enviarMensagem(this.whatsappForm.value).subscribe(() => {
        this._alertService.success('Mensagem enviada com sucesso!');
        this.fechaModal();
      }, () => {
        this._alertService.error('Erro ao enviar mensagem.');
      });
    } else {
      this._alertService.warning('Preencha todos os campos obrigatórios.');
    }
  }

  public fechaModal() {
    this.abrirModal = false;
    this._modalService.dismissAll();
  }

  private limparNumero(telefone: string): string {
    return telefone.replace(/[\(\)\s\-\.]/g, '');
  }

  public contarCaracteres(): void {
    const mensagemControl = this.whatsappForm.get('whats.0.mensagem');
    if (mensagemControl && mensagemControl.value.length > 4096) {
      mensagemControl.setValue(mensagemControl.value.substring(0, 4096));
    }
  }
}
