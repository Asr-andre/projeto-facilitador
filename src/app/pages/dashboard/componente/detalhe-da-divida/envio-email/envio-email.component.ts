import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-envio-email',
  templateUrl: './envio-email.component.html',
  styleUrl: './envio-email.component.scss'
})
export class EnvioEmailComponent {
  @ViewChild('emailModal') emailModal: TemplateRef<any>;
  public email: string;
  public assunto: string = '';
  public mensagem: string = '';

  constructor(private modalService: NgbModal) {}

  public abrirModalEmail(email: string): void {
    this.email = email;
    const modalRef = this.modalService.open(this.emailModal, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  }

  public enviarEmail(): void {
    // Lógica para enviar o email
    console.log('Enviando email para:', this.email);
    console.log('Assunto:', this.assunto);
    console.log('Mensagem:', this.mensagem);
    // Adicione sua lógica de envio de email aqui
    this.fechaModal(); // Fecha o modal após o envio
  }

  public fechaModal() {

  }

  public contarCaracteres(): void {

  }
}
