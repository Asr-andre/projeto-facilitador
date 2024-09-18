import { Component, OnInit } from '@angular/core';
import { EmailContaModel } from 'src/app/core/models/cadastro/email.conta.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmailContaService } from 'src/app/core/services/cadastro/email.conta.service';

@Component({
  selector: 'app-email-conta',
  templateUrl: './email-conta.component.html',
  styleUrl: './email-conta.component.scss'
})
export class EmailContaComponent implements OnInit {
  public emailConta: EmailContaModel[] = [];
  public idEmpresa = Number(this._auth.getIdEmpresa());

  constructor(
    private _emailContaService: EmailContaService,
    private _auth: AuthenticationService,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.obterEmailConta();
  }

  public obterEmailConta() {
    const dados = {
      id_empresa: this.idEmpresa,
      id_Perfilemail: 0
    }

    this._emailContaService.obterEmailConta(dados).subscribe((res) => {
      this.emailConta = res.perfil;
    });
  }
}
