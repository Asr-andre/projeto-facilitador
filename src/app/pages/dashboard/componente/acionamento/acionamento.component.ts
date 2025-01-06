import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, debounceTime } from 'rxjs';
import { Utils } from 'src/app/core/helpers/utils';
import { AcionamentoModel, RequisicaoAcionamentoModel } from 'src/app/core/models/acionamento.model';
import { AcaoCobrancaModel, RequisicaoAcaoCobrancaModel } from 'src/app/core/models/acoes.cobranca.model';
import { AcaoCobrancaService } from 'src/app/core/services/acao.cobranca.service';
import { AcionamentoService } from 'src/app/core/services/acionamento.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: "app-acionamento",
  templateUrl: "./acionamento.component.html",
  styleUrl: "./acionamento.component.scss",
})
export class AcionamentoComponent implements OnChanges, OnInit {
  @ViewChild("acaoDeCobrancaModal") modalEmailRef: TemplateRef<any>;
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  @Output() clienteAcionado = new EventEmitter<void>();
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public usuario: string = this._auth.getLogin();
  public idUsuario: number = Number(this._auth.getCurrentUser() || 0);
  public acionamentos: AcionamentoModel[] = [];
  public acoesCobranca: AcaoCobrancaModel[] = [];
  public formAcionamento: FormGroup;
  public conteudoCompleto: string = "";
  public textoVisivel: string = ''; // Armazena o texto atualmente visível


  private updateSubject: Subject<void> = new Subject<void>();

  constructor(
    private _alertService: AlertService,
    private _modalService: NgbModal,
    private _auth: AuthenticationService,
    private _acionamentoService: AcionamentoService,
    private _acaoCobrancaService: AcaoCobrancaService,
    private _formBuilder: FormBuilder,
    private _datePipe: DatePipe
  ) {
    this.updateSubject.pipe(debounceTime(300)).subscribe(() => this.listarAcionamentos());
  }

  ngOnInit(): void {
    this.inicializarformAcionamentos();

    this.formAcionamento.get('id_acao')?.valueChanges.subscribe((idAcaoSelecionada) => {
      const acaoSelecionada = this.acoesCobranca.find(acao => acao.id_acao === Number(idAcaoSelecionada));

      if (acaoSelecionada && acaoSelecionada.data_prox_acio) {
        this.formAcionamento.get('data_prox_acio')?.enable(); // Habilita o campo

        const dataFormatada = this._datePipe.transform(acaoSelecionada.data_prox_acio, 'dd/MM/yyyy HH:mm');
        this.formAcionamento.get('data_prox_acio')?.setValue(dataFormatada); // Atualiza o valor
      } else {
        this.formAcionamento.get('data_prox_acio')?.disable(); // Desabilita o campo
        this.formAcionamento.get('data_prox_acio')?.setValue(null); // Limpa o valor
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["idCliente"] || changes["idContratante"]) {
      this.updateSubject.next();
    }
  }

  public inicializarformAcionamentos() {
    this.formAcionamento = this._formBuilder.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [this.idContratante],
      id_cliente: [this.idCliente],
      id_acao: ['', Validators.required],
      data_prox_acio: [{ value: null, disabled: true }], // Inicializa desabilitado
      id_usuario: [this.idUsuario],
      mensagem: ["", Validators.required],
      user_login: [this.usuario],
    });
  }

  public listarAcionamentos(): void {
    if (this.idCliente && this.idContratante) {
      const requisicao: RequisicaoAcionamentoModel = {
        id_empresa: this.idEmpresa,
        id_contratante: this.idContratante,
        id_cliente: this.idCliente,
      };

      this._acionamentoService.listarAcionamentos(requisicao).subscribe((res) => {
        if (res.success) {
          this.acionamentos = res.acionamentos;
        } else {
          this._alertService.error(res.msg);
        }
      },
        (error) => {
          this._alertService.error("Erro ao listar acionamentos");
        }
      );
    }
  }

  public listarAcoesCobranca(): void {
    if (!this.idEmpresa) return;

    if (this.idEmpresa) {
      const requisicao: RequisicaoAcaoCobrancaModel = {
        id_empresa: this.idEmpresa,
      };

      this._acaoCobrancaService.listarAcoesCobranca(requisicao).subscribe((res) => {
        if (res.success) {
          this.acoesCobranca = res.contratantes;
        } else {
          this._alertService.error(res.msg);
        }
      },
        (error) => {
          this._alertService.error("Erro ao listar ações de cobrança");
        }
      );
    }
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }

  public abriracaoDeCobrancaModal(modal): void {
    this.formAcionamento.patchValue({
      id_cliente: this.idCliente,
      id_contratante: this.idContratante,
      id_empresa: this.idEmpresa,
      id_usuario: this.idUsuario,
      mensagem: "",
      user_login: this.usuario,
    });

    this.listarAcoesCobranca();

    this._modalService.open(this.modalEmailRef, { size: "lg", ariaLabelledBy: "modal-basic-title",  backdrop: "static", keyboard: false,});
  }

  public enviarAcionamento(): void {
    if (this.formAcionamento.invalid) {
      this.marcarCamposComoTocados(this.formAcionamento);
      this._alertService.warning('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    const acionamento = { ...this.formAcionamento.value };

    if (acionamento.data_prox_acio) {
      acionamento.data_prox_acio = this._datePipe.transform(acionamento.data_prox_acio, 'dd/MM/yyyy HH:mm:ss');
    } else {
      acionamento.data_prox_acio = '';
    }

    this._acionamentoService.inserirAcionamento(acionamento).subscribe((res) => {
      if (res.success) {
        this._alertService.success(res.msg);
        this.listarAcionamentos();
        this.clienteAcionado.emit();
        this.fechar();
      } else {
        this._alertService.error(res.msg);
      }
    },
      (error) => {
        this._alertService.error("Erro ao inserir acionamento");
      }
    );
  }

  private marcarCamposComoTocados(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      const controle = formGroup.get(campo);
      controle?.markAsTouched();
      controle?.updateValueAndValidity();
    });
  }

  public mostraConteudoTruncado(texto: string, limite: number): string {
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  }

  public exibirConteudoCompleto(acionamento: any, campo: string): void {
    acionamento[campo + '_visivel'] = acionamento[campo]; // Mostra o texto completo
  }

  public ocultarConteudoTruncado(acionamento: any, campo: string, limite: number): void {
    acionamento[campo + '_visivel'] = this.mostraConteudoTruncado(acionamento[campo], limite); // Volta ao texto truncado
  }

  public copiarParaAreasTransferencia(valor) {
    Utils.CopyAreaTransfer(valor);
    this._alertService.success('Acionamento copiado para area de transferência!');
  }

  public fechar() {
    this.formAcionamento.reset();
    this._modalService.dismissAll();
  }
}
