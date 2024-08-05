import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Utils } from "src/app/core/helpers/utils";
import { SimuladorPadraoService } from "src/app/core/services/simulador.padrao.sevice";
import { BaixaPagamentoRequisicaoModel, RecalculoRetornoModel } from "src/app/core/models/simulador.padrao.model";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { DatePipe } from "@angular/common";
import { AlertService } from "src/app/core/services/alert.service";

@Component({
  selector: "app-simulador-padrao",
  templateUrl: "./simulador-padrao.component.html",
  styleUrls: ["./simulador-padrao.component.scss"],
})
export class SimuladorPadraoComponent implements OnInit, OnChanges {
  @ViewChild("modalTemplate") modalTemplate: any;
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  private modalRef: NgbModalRef;
  public descontoMaximo: any;
  public data: any;
  public form: FormGroup;
  public formAcordo: FormGroup;
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public login = this._authService.getLogin();
  public habilitarAcordo: boolean = false;
  public simulaAcordo: boolean = false;
  public dadosSimulacao: any;

  @Output() clienteAtualizado = new EventEmitter<void>();

  public totalJuros: number = 0;
  public totalMulta: number = 0;
  public totalTaxa: number = 0;
  public totalGeral: number = 0;
  public totalValor: number = 0;

  public totalAcordo: number = 0;

  public originalPrincipal: number = 0;
  public originalMulta: number = 0;
  public originalJuros: number = 0;
  public originalTaxa: number = 0;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private simuladorService: SimuladorPadraoService,
    private _authService: AuthenticationService,
    private datePipe: DatePipe,
    private _alertService: AlertService
  ) {
    this.idEmpresa = Number(this._authService.getIdEmpresa()) || 0;
    this.idCliente = this.idCliente || null;
    this.idContratante = this.idContratante || null;
  }

  ngOnInit(): void {
    this.formSimulador();
    this.formsimuladorAcordo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["idCliente"] || changes["idContratante"]) {
      this.formsimuladorAcordo();
    }
  }

  public formSimulador() {
    this.form = this.fb.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [this.idContratante],
      id_cliente: [this.idCliente],
      desconto_principal: ["", Validators.min(0)],
      desconto_multa: ["", Validators.min(0)],
      desconto_juros: ["", Validators.min(0)],
      desconto_taxa: ["", Validators.min(0)],
      data_atualizacao: [""],
      titulos: [""],
      user_login: [this.login],
    });
  }

  public formsimuladorAcordo() {
    this.formAcordo = this.fb.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [this.idContratante || null],
      id_cliente: [this.idCliente],
      data_acordo: [this.datePipe.transform(new Date(), "dd/MM/yyyy")],
      valor_acordo: [this.totalGeral],
      qtde_parcelas: [1, Validators.required],
      periodicidade: ["M"],
      valor_entrada: [0, Validators.required],
      vencimento: [""],
      titulos: [""],
      user_login: [this.login],
    });
  }

  public abrirModalSimulado(data: any): void {
    this.data = data;

    this.originalPrincipal = data.desconto_principal;
    this.originalMulta = data.desconto_multa;
    this.originalJuros = data.desconto_juros;
    this.originalTaxa = data.desconto_taxa;

    const dataAtualizacao = data.data_atualizacao
      ? this.datePipe.transform(data.data_atualizacao, "yyyy-MM-dd")
      : this.datePipe.transform(new Date(), "yyyy-MM-dd");

    this.form.patchValue({
      id_empresa: this.idEmpresa,
      id_contratante: this.idContratante,
      id_cliente: this.idCliente,
      desconto_principal: data.desconto_principal,
      desconto_multa: data.desconto_multa,
      desconto_juros: data.desconto_juros,
      desconto_taxa: data.desconto_taxa,
      data_atualizacao: dataAtualizacao,
      titulos: data.titulos.map((titulo) => titulo.id_titulo).join(","),
      user_login: data.user_login,
    });

    this.formAcordo.patchValue({
      titulos: data.titulos.map((titulo) => titulo.id_titulo).join(","),
    });

    this.calcularTotais();
    this.modalRef = this.modalService.open(this.modalTemplate, { size: "lg", ariaLabelledBy: "modal-basic-title", backdrop: "static", keyboard: false, });
  }

  public recalcular(): void {
    const dadosParaEnvio = { ...this.form.value };
    dadosParaEnvio.data_atualizacao = this.datePipe.transform(dadosParaEnvio.data_atualizacao, "dd/MM/yyyy");

    this.simuladorService.recalcularNegociacao(dadosParaEnvio).subscribe(
      (response: RecalculoRetornoModel) => {
        this.data = response;
        this.calcularTotais();
      },
      (error) => {
        this._alertService.error("Erro ao recalcular:", error);
      }
    );
  }

  private calcularTotais(): void {
    this.totalValor = this.data.titulos.reduce((acc, titulo) => acc + titulo.valor, 0);
    this.totalJuros = this.data.titulos.reduce((acc, titulo) => acc + titulo.valor_juros, 0);
    this.totalMulta = this.data.titulos.reduce((acc, titulo) => acc + titulo.valor_multa, 0);
    this.totalTaxa = this.data.titulos.reduce((acc, titulo) => acc + titulo.valor_taxa, 0);
    this.totalGeral = this.data.titulos.reduce((acc, titulo) => acc + titulo.valor_atualizado,0);

    this.formAcordo.patchValue({
      valor_acordo: this.totalGeral,
    });
  }

  public dataBrasil(data) {
    return Utils.dataBrasil(data);
  }

  public validarDesconto(event: any, tipo: string): void {
    const input = event.target;
    const valorMaximo = this[`original${tipo}`];
    const valorAtual = Number(input.value);

    if (valorAtual > valorMaximo) {
      input.value = valorMaximo;
    }
  }

  public baixarPagamentos(): void {
    const titulos = this.data.titulos.map((titulo) => ({
      id_titulo: titulo.id_titulo,
      valor: titulo.valor,
      valor_multa: titulo.valor_multa,
      valor_juros: titulo.valor_juros,
      valor_taxa: titulo.valor_taxa,
      valor_atualizado: titulo.valor_atualizado,
    }));

    const dadosParaEnvio: BaixaPagamentoRequisicaoModel = {
      id_empresa: this.idEmpresa,
      id_contratante: this.idContratante,
      id_cliente: this.idCliente,
      data_negociacao: this.datePipe.transform(this.form.get("data_atualizacao").value, "dd/MM/yyyy")!,
      tipo_baixa: "P",
      user_login: this.login,
      titulos: titulos,
    };

    this.simuladorService.baixarTitulosPago(dadosParaEnvio).subscribe(
      (res) => {
        this._alertService.success(res.msg);
        this.clienteAtualizado.emit();
        this.fechaModal();
      },
      (error) => {
        this._alertService.error("Ocorreu um erro ao realizar a baixa.", error);
      }
    );
  }

  public habilitaBotao() {
    this.habilitarAcordo = true;
    this.simulaAcordo = false;
  }

  public habilitaBotaoSimulaAcordo() {
    this.simulaAcordo = true;
  }

  public fechaModal() {
    this.habilitarAcordo = false;
    this.simulaAcordo = false;
    this.modalRef.dismiss();
  }

  public simularAcordo() {
    if (this.formAcordo.valid) {
      const dadosParaEnvio = { ...this.formAcordo.value };
      dadosParaEnvio.vencimento = this.datePipe.transform(dadosParaEnvio.vencimento, "dd/MM/yyyy");

      this.simuladorService.simularAcordo(dadosParaEnvio).subscribe(
        (response) => {
          if (response.success) {
            this.dadosSimulacao = response;
            this.totalAcordo = this.dadosSimulacao.titulos.reduce((acc: number, item: any) => acc + item.valor, 0);
            this.simulaAcordo = true;
          } else {
            this._alertService.error(response.msg);
          }
        },
        (error) => {
          this._alertService.error("Ocorreu um erro ao simular o acordo.");
        }
      );
    }
  }

  public fecharAcordo() {
    if (this.formAcordo.valid) {
      const dadosParaEnvio = { ...this.formAcordo.value };
      dadosParaEnvio.vencimento = this.datePipe.transform(dadosParaEnvio.vencimento, "dd/MM/yyyy");

      this.simuladorService.fecharAcordo(dadosParaEnvio).subscribe((res) => {
          if (res.success === 'true') {
            this._alertService.success(res.msg);
            this.clienteAtualizado.emit();
            this.fechaModal();
          } else {
            this._alertService.error(res.msg);
          }
        },
        (error) => {
          this._alertService.error("Ocorreu um erro ao fechar o acordo.", error);
        }
      );
    } else {
      this._alertService.error("Formulário inválido. Por favor, verifique os campos e tente novamente.");
    }
  }
}
