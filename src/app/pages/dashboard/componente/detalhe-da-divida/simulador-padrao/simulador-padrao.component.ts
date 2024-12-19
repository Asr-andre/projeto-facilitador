import { Titulo } from './../../../../../core/models/geraca.pix.model';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Utils } from "src/app/core/helpers/utils";
import { SimuladorPadraoService } from "src/app/core/services/simulador.padrao.sevice";
import { BaixaPagamentoRequisicaoModel, RecalculoRetornoModel } from "src/app/core/models/simulador.padrao.model";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { DatePipe } from "@angular/common";
import { AlertService } from "src/app/core/services/alert.service";
import { GeracaoPixService } from "src/app/core/services/geraca.pix.service";
import { GerarPixResponse } from "src/app/core/models/geraca.pix.model";

@Component({
  selector: "app-simulador-padrao",
  templateUrl: "./simulador-padrao.component.html",
  styleUrls: ["./simulador-padrao.component.scss"],
})
export class SimuladorPadraoComponent implements OnInit, OnChanges {
  @ViewChild("modalTemplate") modalTemplate: any;
  @ViewChild("pixTitulosModal") pixTitulos: SimuladorPadraoComponent;
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  @Input() numeroContrato: string | undefined;
  @Input() numeroDocumento: string | undefined;
  private modalRef: NgbModalRef;
  public descontoMaximo: any;
  public data: any;
  public form: FormGroup;
  public formAcordo: FormGroup;
  public formGerarPixBoleto: FormGroup;
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public sigla = this._authService.getSigla()
  public login = this._authService.getLogin();
  public habilitarAcordo: boolean = false;
  public simulaAcordo: boolean = false;
  public ocultaBotaoPix: boolean = true;
  public dadosSimulacao: any;
  public dadosPixGerado: GerarPixResponse;

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

  //essa variavel e responsavel por armazenar o valor atualziado sera suada apenas par ao metodo gerar pix do titulo, solicitação do pedro
  public valor_atualizado_simulador = 0;

  constructor(
    private _geracaoPixService: GeracaoPixService,
    private fb: FormBuilder,
    private simuladorService: SimuladorPadraoService,
    private _authService: AuthenticationService,
    private datePipe: DatePipe,
    private _alertService: AlertService,
    private _modalService: NgbModal,
  ) {
    this.idEmpresa = Number(this._authService.getIdEmpresa()) || 0;
    this.idCliente = this.idCliente || null;
    this.idContratante = this.idContratante || null;
  }

  ngOnInit(): void {
    this.formSimulador();
    this.formsimuladorAcordo();
    this.iniciarFormgerarPixBoleto();
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
      id_acordo: [],
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

  public iniciarFormgerarPixBoleto() {
    this.formGerarPixBoleto = this.fb.group({
      id_empresa: [this.idEmpresa, Validators.required],
      id_contratante: [this.idContratante, Validators.required],
      id_cliente: [this.idCliente, Validators.required],
      id_usuario: [this._authService.getCurrentUser(), Validators.required], // ID do usuário logado
      user_login: [this.login, Validators.required],
      valor_boleto: [this.valor_atualizado_simulador.toFixed(2), Validators.required],
      servico: ['Pagamento Titulos Via Pix', Validators.required],
      titulos: this.fb.array([], Validators.required) // Array de títulos
    });

    // Referenciando o FormArray de títulos
    const titulosArray = this.formGerarPixBoleto.get('titulos') as FormArray;

    // Adicionando os títulos ao FormArray baseado nos dados da simulação
    this.data?.titulos.forEach((titulo) => {
      titulosArray.push(this.fb.group({
        id_titulo: [titulo.id_titulo, Validators.required],
        numero_contrato: [this.numeroContrato || '', Validators.required],
        data_vencimento: [this.datePipe.transform(titulo.vencimento, 'dd/MM/yyyy')!, Validators.required],
        valor: [titulo.valor.toFixed(2), Validators.required],
        valor_multa: [titulo.valor_multa.toFixed(2), Validators.required],
        valor_juros: [titulo.valor_juros.toFixed(2), Validators.required],
        valor_taxa: [titulo.valor_taxa.toFixed(2), Validators.required],
        valor_atualizado: [titulo.valor_atualizado.toFixed(2), Validators.required],
        atraso: [titulo.atraso, Validators.required],
        desc_principal: [this.originalPrincipal, Validators.required],
        desc_multa: [this.originalMulta, Validators.required],
        desc_juros: [this.originalJuros, Validators.required],
        desc_taxa: [this.originalTaxa, Validators.required]
      }));
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

    this.calcularTotais();  // Calcula os totais para atualizar valor_atualizado_simulador
    this.iniciarFormgerarPixBoleto();  // Reinicia o form de créditos após calcular os totais
    this.modalRef = this._modalService.open(this.modalTemplate, { size: "lg", ariaLabelledBy: "modal-basic-title", backdrop: "static", keyboard: false, });
  }

  public recalcular(): void {
    const dadosParaEnvio = { ...this.form.value };
    dadosParaEnvio.data_atualizacao = this.datePipe.transform(dadosParaEnvio.data_atualizacao, "dd/MM/yyyy");

    this.simuladorService.recalcularNegociacao(dadosParaEnvio).subscribe(
      (response: RecalculoRetornoModel) => {
        this.data = response;
        this.calcularTotais();
        this.iniciarFormgerarPixBoleto();  // Reinicia o formulário de créditos com os valores atualizados
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

    this.valor_atualizado_simulador = this.totalGeral !== 0 ? this.totalGeral : this.totalValor;

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
      valor_atualizado: titulo.valor_atualizado === 0 ? titulo.valor : titulo.valor_atualizado
    }));

    const dadosParaEnvio: BaixaPagamentoRequisicaoModel = {
      id_empresa: this.idEmpresa,
      id_contratante: this.idContratante,
      id_cliente: this.idCliente,
      id_acordo: this.numeroContrato,
      data_negociacao: this.datePipe.transform(this.form.get("data_atualizacao").value, "dd/MM/yyyy")!,
      tipo_baixa: "P",
      user_login: this.login,
      titulos: titulos,
    };

    console.log(`este e o numero de contrato recebido${ this.numeroContrato }`)

    this._alertService.baixarPg().then(confirmarPg => {
      if (!confirmarPg) {
        return;
      }
      console.log(dadosParaEnvio);

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
    });
  }

  public habilitaBotao() {
    this.habilitarAcordo = true;
    this.simulaAcordo = false;
    this.ocultaBotaoPix = false;
  }

  public habilitaBotaoSimulaAcordo() {
    this.simulaAcordo = true;
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

  public gerarPixBoleto() {
      const confirmar = confirm(`Você deseja gerar um PIX com o valor total atualizado de R$ ${this.formGerarPixBoleto.get('valor_boleto')?.value}?`);

      if (confirmar) {
        this._geracaoPixService.gerarPixBoleto(this.formGerarPixBoleto.value).subscribe((res) => {
          if (res.success === "true") {
            this.dadosPixGerado = res;
            this.abrirModalPixTitulos();
            this.modalRef.dismiss();
          } else {
            this._alertService.warning("Erro na resposta da API:", res.msg || "Mensagem não disponível");
          }
        });
      }
  }

  public copiarParaAreasTransferencia(valor) {
    Utils.CopyAreaTransfer(valor);
    this._alertService.success('Código Pix copiado com sucesso!');
  }

  public abrirModalPixTitulos(): void {
    this._modalService.open(this.pixTitulos, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
  }

  public closeModal() {
    this._modalService.dismissAll();
  }

  public fechaModal() {
    this.habilitarAcordo = false;
    this.simulaAcordo = false;
    this.modalRef.dismiss();
  }
}
