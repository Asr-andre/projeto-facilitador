import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrl: './whatsapp.component.scss'
})
export class WhatsappComponent {

  @ViewChild('whatsappModal') whatsappModal: TemplateRef<any>;
  public abrirModal = false;
  public mensagem: string = '';
  public telefoneCliente: string;

  constructor(
    private _modalService: NgbModal
  ) { }

  public abrirModalWhatsapp(telefone: string): void {
    this.telefoneCliente = this.limparNumero(telefone);
    this.abrirModal = true;
    this._modalService.open(this.whatsappModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  public enviarMensagem(): void {
    if (this.telefoneCliente && this.mensagem) {
      const telefone = encodeURIComponent(this.telefoneCliente);
      const mensagem = encodeURIComponent(this.mensagem);

      const url = `https://api.whatsapp.com/send?phone=${telefone}&text=${mensagem}`;

      window.open(url, '_blank');
      this.fechaModal();
    } else {
      console.error('Telefone ou mensagem não preenchidos.');
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
}
