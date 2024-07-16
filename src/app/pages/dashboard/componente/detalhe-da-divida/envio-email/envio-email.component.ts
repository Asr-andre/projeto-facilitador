import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnvioEmailModel } from 'src/app/core/models/email.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmailService } from 'src/app/core/services/email.service';

@Component({
  selector: 'app-envio-email',
  templateUrl: './envio-email.component.html',
  styleUrl: './envio-email.component.scss'
})
export class EnvioEmailComponent implements OnInit {
  @ViewChild('emailModal') emailModal: TemplateRef<any>;
public email: string;
  public formEnvioEmail: FormGroup;
  public assunto: string = '';
  public mensagem: string = '';

  constructor(
    private _modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _emailService: EmailService,
    private _authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.inicializarformEnvioEmail();
  }

  public inicializarformEnvioEmail() {
    this.formEnvioEmail = this._formBuilder.group({
      id_empresa: [Number(this._authenticationService.getIdEmpresa())],
      id_contratante: [""],
      id_cliente: [""],
      destinatario: [""],
      assunto: [""],
      mensagem: [""],
      anexo: [""],
    });
  }

  public abrirModalEmail(email: string, idCliente: number | undefined, idContratante: number | undefined): void {
    this.formEnvioEmail.patchValue({
      id_cliente: idCliente,
      id_contratante: idContratante,
      destinatario: email
    });
    this._modalService.open(this.emailModal, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  }

  public enviarEmail(): void {
    this._emailService.envioEmailUnitario(this.formEnvioEmail.value).subscribe((res) => {
      if(res.success === "true") {
        console.log(`esse e o resultado do envio ${res}`);
      }else {
        console.log(`algo deu errado ${res}`);
      }
    });
  }

  public contarCaracteres(): void {

  }
}
