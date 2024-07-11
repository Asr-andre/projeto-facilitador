import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss']
})
export class WhatsappComponent {
  @ViewChild('whatsappModal') whatsappModal: TemplateRef<any>;
  public abrirModal = false;
  public mensagem: string = '';
  public telefoneCliente: string;

  constructor(
    private _modalService: NgbModal,
    private _alertService: AlertService,
  ) { }

  public abrirModalWhatsapp(telefone: string): void {
    if (telefone) {
      this.telefoneCliente = this.limparNumero(telefone);
      this.abrirModal = true;
      this._modalService.open(this.whatsappModal, { ariaLabelledBy: 'modal-basic-title' });
    } else {
      this._alertService.warning('Selecione o cliente  para obter o número de telefone.');
    }
  }

  public enviarMensagem(): void {
    if (this.telefoneCliente && this.mensagem) {

      const telefone = this.limparNumero(this.telefoneCliente);
      const telefoneEncoded = encodeURIComponent(telefone);
      const mensagemEncoded = encodeURIComponent(this.mensagem);

      const url = `https://api.whatsapp.com/send?phone=55${telefoneEncoded}&text=${mensagemEncoded}`;

      window.open(url, '_blank');
      this.fechaModal();
    } else {
      this._alertService.warning('Digite a mensagem que deseja enviar');
    }
  }

  public fechaModal() {
    this.abrirModal = false;
    this.mensagem = '';
    this._modalService.dismissAll();
  }

  private limparNumero(telefone: string): string {
    return telefone.replace(/[\(\)\s\-\.]/g, '');
  }

  public contarCaracteres(): void {
    if (this.mensagem.length > 4096) {
      this.mensagem = this.mensagem.substring(0, 4096);
    }
  }
}
