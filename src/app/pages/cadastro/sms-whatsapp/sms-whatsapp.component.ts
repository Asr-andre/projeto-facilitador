import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sms-whatsapp',
  templateUrl: './sms-whatsapp.component.html',
  styleUrl: './sms-whatsapp.component.scss'
})
export class SmsWhatsappComponent {
  public loading: boolean = false;
  public loadingMin: boolean = false;


  constructor(
    private _modalService: NgbModal
  ) {}

  public abriModalCadastro(content: TemplateRef<any>): void {

    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  fechar() {
    this._modalService.dismissAll();
  }
}
