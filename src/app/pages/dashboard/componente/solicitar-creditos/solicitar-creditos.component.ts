import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from 'src/app/core/helpers/utils';
import { HistoricoItem, PixDetails } from 'src/app/core/models/solicitar.creditos.model';
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
  public formCreditos: FormGroup;
  public historicoForm: FormGroup;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public idUsuario: number = Number(this._auth.getIdUsuario() || 0);
  public sigla = this._auth.getSigla();
  public login = this._auth.getLogin();
  public dadosPixGerado: PixDetails;
  public mostraQrCode: Boolean = false;
  public loadingMin: Boolean = false;
  public desabilitarBotaoPix: Boolean = true;
  public historico: Boolean = false;
  public ocultarBotaoCredito: Boolean = true;
  public retornoHistorico: HistoricoItem [] = [];

  constructor(
    private _solicitarCreditosService: SolicitarCreditosService,
    private _fb: FormBuilder,
    private _auth: AuthenticationService,
    private _alertService: AlertService,
    private _modalService: NgbModal,
    private _datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.iniciarFormCreditos();
    this.iniciarFormHistorico();
  }

  public iniciarFormCreditos() {
    this.formCreditos = this._fb.group({
      id_empresa: [this.idEmpresa],
      nome: [this.sigla, Validators.required],
      cpf: ['46419730325', Validators.required],
      valor: ['', Validators.required],
      servico: ['', Validators.required],
      user_login: [this.login]
    });
  }

  public iniciarFormHistorico() {
    this.historicoForm = this._fb.group({
      id_empresa: [this.idEmpresa],
      data_inicio: ['', Validators.required],
      data_fim: ['', Validators.required],
      user_login: [this.login]
    });
  }

  public comprarCreditos() {
    if(this.formCreditos.valid) {
      this.loadingMin = true;
      this._solicitarCreditosService.gerarPix(this.formCreditos.value).subscribe((res) => {
        if (res.success === "true")  {
          this.dadosPixGerado = res.pix;
          this.mostraQrCode = true;
          this.desabilitarBotaoPix = false;
          this.historico = false;
          this.loadingMin = false;
        }else {
          this.loadingMin = false;
          this._alertService.warning("Erro na resposta da API:", res.msg || "Mensagem não disponível");
        }
      });
    } else {
      this._alertService.warning("Todos os campos são obrigatórios:");
    }

  }

  public obterHistorico() {
    const formValues = this.historicoForm.value;

    const dadosParaEnvio = { ...formValues };
    dadosParaEnvio.data_inicio = this._datePipe.transform(dadosParaEnvio.data_inicio, "dd/MM/yyyy") || "";
    dadosParaEnvio.data_fim = this._datePipe.transform(dadosParaEnvio.data_fim, "dd/MM/yyyy") || "";

    this.loadingMin = true;
    this._solicitarCreditosService.obterHistorico(dadosParaEnvio).subscribe((res) => {
        this.retornoHistorico = res.data;
        this.loadingMin = false;
      },
      (error) => {
        this.loadingMin = false;
        this._alertService.error("Erro ao obter histórico, por favor, tente novamente.", error);
      }
    );
  }

  public abrirModaSolicitarCredito(): void {
    this.resetarCampos();
    this.mostraQrCode = false;
    this.iniciarFormHistorico();
    this._modalService.open(this.creditosModal, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
  }

  public fechaModal() {
    this.historico = false;
    this.formCreditos.reset();
    this.retornoHistorico = [];
    this._modalService.dismissAll();
    this.ocultarBotaoCredito = true;
  }

  private resetarCampos() {
    this.formCreditos.patchValue({
      valor: '',
      servico: ''
    });
  }

  public copiarParaAreasTransferencia(valor) {
    Utils.CopyAreaTransfer(valor);
    this._alertService.copiado();
  }

  public atualizarDadosPix(pixCopiaCola: string, imgPix: string) {
    this.dadosPixGerado = {
      ...this.dadosPixGerado,
      pixCopiaECola: pixCopiaCola,
      urlImagemQrCode: imgPix
    };

    this.mostraQrCode = true;
  }

  public botaoHistorico() {
    this.historico = true;
    this.ocultarBotaoCredito = false;
  }
}
