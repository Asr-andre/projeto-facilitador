import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseOptionRefiners } from '@fullcalendar/core/internal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PixDetails } from 'src/app/core/models/solicitar.creditos.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { SolicitarCreditosService } from 'src/app/core/services/solicitar.creditos.service';

@Component({
  selector: 'app-solicitar-creditos',
  templateUrl: './solicitar-creditos.component.html',
  styleUrl: './solicitar-creditos.component.scss'
})
export class SolicitarCreditosComponent implements OnInit {
  @ViewChild("creditosModal") creditosModal: SolicitarCreditosComponent;
  public formCreditos: FormGroup
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._authService.getCurrentUser() || 0);
  public sigla = this._authService.getSigla();
  public login = this._authService.getLogin();
  public dadosPixGerado: PixDetails;
  public mostraQrCode: Boolean = false;
  public loading: boolean = false;
  public desabilitarBotaoPix: boolean = true;

  constructor(
    private _solicitarCreditosService: SolicitarCreditosService,
    private _formBuilder: FormBuilder,
    private _authService: AuthenticationService,
    private _alertService: AlertService,
    private _modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.iniciarFormCreditos();
  }

  public iniciarFormCreditos() {
    this.formCreditos = this._formBuilder.group({
      id_empresa: [this.idEmpresa],
      nome: [this.sigla, Validators.required],
      cpf: ['46419730325', Validators.required],
      valor: ['', Validators.required],
      servico: ['', Validators.required],
      user_login: [this.login]
    });
  }

  public comprarCreditos() {
    if(this.formCreditos.valid) {
      this.loading = true;
      this._solicitarCreditosService.gerarPix(this.formCreditos.value).subscribe((res) => {
        if (res.success === "true")  {
          this.dadosPixGerado = res.pix;
          this.mostraQrCode = true;
          this.desabilitarBotaoPix = false;
          this.loading = false;
        }else {
          this.loading = false;
          this._alertService.warning("Erro na resposta da API:", res.msg || "Mensagem não disponível");
        }
      });
    } else {
      this._alertService.warning("Todos os campos são obrigatórios:");
    }

  }

  public abrirModaSolicitarCredito(): void {
      this._modalService.open(this.creditosModal, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
  }

  public fechaModal() {
    this.formCreditos.reset();
    this._modalService.dismissAll();
  }

  public copiarPix() {
    const pixCopiaCola = document.getElementById('pixCopiaCola')?.textContent || '';
    navigator.clipboard.writeText(pixCopiaCola).then(() => {
      this._alertService.success('Código Pix copiado com sucesso!');
    }, (err) => {
      this._alertService.error('Erro ao copiar o código Pix: ', err);
    });
  }
}
