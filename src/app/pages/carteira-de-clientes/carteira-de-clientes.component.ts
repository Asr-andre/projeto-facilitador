import { DatePipe } from "@angular/common";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Utils } from "src/app/core/helpers/utils";
import { ContratanteModel } from "src/app/core/models/cadastro/contratante.model";
import { PerfilWhatsappModel } from "src/app/core/models/cadastro/sms.whatsapp.model";
import { CarteiraClienteModel } from "src/app/core/models/carteira.de.cliente.model";
import { FilaModel, FilaRequisicaoModel } from "src/app/core/models/fila.model";
import { AlertService } from "src/app/core/services/alert.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { ContratanteService } from "src/app/core/services/cadastro/contratante.service";
import { SmsWhatsAppService } from "src/app/core/services/cadastro/sms.whatsapp.service";
import { CarteiraDeClienteService } from "src/app/core/services/carteira.de.cliente.service";
import { ExcelService } from "src/app/core/services/excel.service";
import { FilaService } from "src/app/core/services/fila.service";
import { WhatsappService } from "src/app/core/services/whatsapp.service";

@Component({
  selector: "app-carteira-de-clientes",
  templateUrl: "./carteira-de-clientes.component.html",
  styleUrl: "./carteira-de-clientes.component.scss",
})
export class CarteiraDeClientesComponent implements OnInit {
  public contratantes: ContratanteModel[] = [];
  public formCarteiraCliente: FormGroup;
  public formFila: FormGroup;
  public formMsgLote: FormGroup;
  public carteiraDeClientes: CarteiraClienteModel[] = [];
  public idEmpresa = Number(this._auth.getIdEmpresa());
  public contratanteSelecionado: number;
  public login = this._auth.getLogin();
  public filtros: boolean = false;
  public loading: boolean =false;
  public ativaAba: number = 1;
  public selecionarTodos: boolean = false;
  public clienteSelecionado: CarteiraClienteModel | null = null;
  public filas: FilaModel[]=[];
  public idUsuario: number | null = null;
  public idPerfilWhatsapp = 1;
  public msg: PerfilWhatsappModel[] = [];
  public loadingMin: boolean = false;

  public dadosFiltrados: CarteiraClienteModel[] = [];
  public textoPesquisa: string = "";
  public totalRegistros: number = 0;

  public totalClientes: number = 0;
  public valorTotal: number = 0;

  totalClientesSelecionados: number = 0;
  valorTotalSelecionado: number = 0;

  constructor(
    private _contratante: ContratanteService,
    private _carteira: CarteiraDeClienteService,
    private _auth: AuthenticationService,
    private _smsWhatsApp: SmsWhatsAppService,
    private _msgLote: WhatsappService,
    private _alert: AlertService,
    private _fb: FormBuilder,
    private _datePipe: DatePipe,
    private _modal: NgbModal,
    private _fila: FilaService,
    private _excel: ExcelService
  ) { }

  ngOnInit(): void {
    this.obterContratantes();
    this.iniciarForm();
    this.iniciarFormFila();
    this.iniciarFormMsgLote();
  }

  public iniciarForm(): void {
    this.formCarteiraCliente = this._fb.group({
      id_empresa: [this.idEmpresa, Validators.required],
      id_contratante: ["0"],
      cidade: [""],
      uf: [""],
      email: [""],
      celular: [""],
      fone: [""],
      sem_fila: [""],
      com_acordo: [""],
      dias_atraso_inicial: ["-9999"],
      dias_atraso_final: ["9999"],
      periodo_vencimento_inicial: [""],
      periodo_vencimento_final: [""],
      periodo_importacao_inicial: [""],
      periodo_importacao_final: [""],
      dias_sem_acionamento_inicial: [""],
      dias_sem_acionamento_final: [""],
      user_login: [this.login, Validators.required],
    });
  }

  public iniciarFormFila(): void {
    this.formFila = this._fb.group({
      id_empresa: [this.idEmpresa, Validators.required],
      id_fila:["", Validators.required],
      id_usuario: [this.idUsuario],
      user_login: [this.login, Validators.required],
      clientes: [""],
    });
  }

  public iniciarFormMsgLote() {
    this.formMsgLote = this._fb.group({
      id_empresa: [this.idEmpresa, Validators.required],
      id_perfilwhatsapp: ['', Validators.required],
      user_login: [this.login, Validators.required],
      clientes: ['', Validators.required],
      enviar_sms: [false],
      enviar_whatsapp: [true]
    });
  }

  public exportExcel() {
    this._excel.exportAsExcelFile(this.dadosFiltrados, 'exportacaoCarteira');
  }

  public obterContratantes() {
    this.loading = true;
    this._contratante.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.contratantes = res.contratantes;
      this.loading = false;
    },
      (error) => {
        this._alert.error("Ocorreu um erro ao obter os contratantes.");
        this.loading = false;
      }
    );
  }

  public obterFilas() {
    const requisicao: FilaRequisicaoModel = {
     id_empresa: this.idEmpresa,
     user_login: this.login
    }

    this._fila.obterFilas(requisicao).subscribe((res) => {
      this.filas = res.filas;
      this.loading = false;
    });
  }

  public obterMsgs() {
    const dados = {
      id_empresa: this.idEmpresa,
      id_PerfilWhatsapp: this.idPerfilWhatsapp,
      user_login: this.login
    }

    this._smsWhatsApp.obterMsg(dados).subscribe((res) => {
      if (res.success === "true") {
        this.msg = res.perfil_whatsapp;
      } else {
        this._alert.error(res.msg);
      }
    });
  }

  public verificarSelecao(): void {
    this.totalClientesSelecionados = this.dadosFiltrados.filter(cliente => cliente.selecionado).length;
    this.valorTotalSelecionado = this.dadosFiltrados
      .filter(cliente => cliente.selecionado)
      .reduce((total, cliente) => total + cliente.valor_total_divida, 0);
  }

  public marcaTodos(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.dadosFiltrados.forEach(cliente => {
      cliente.selecionado = checked;
    });
    this.verificarSelecao(); // Recalcula os totais ao marcar todos
  }


  public ativarAba() {
    this.ativaAba = 1;
  }

  public abrirModalFila(content: TemplateRef<any>): void {
    const idsClientesSelecionados = this.dadosFiltrados
      .filter(cliente => cliente.selecionado)
      .map(cliente => cliente.id_cliente);

    this.formFila.patchValue({
      clientes: idsClientesSelecionados.join(',')
    });

    this._modal.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public abrirModalMsgLote(content: TemplateRef<any>): void {
    this.obterMsgs();
    const idsSelecionados = this.dadosFiltrados
      .filter(cliente => cliente.selecionado)
      .map(cliente => cliente.id_cliente);


    this.formMsgLote.patchValue({ clientes: idsSelecionados.join(','), enviar_whatsapp: true });
    this._modal.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public enviarMsgLote() {
    if (this.formMsgLote.valid) {

      this.loadingMin = true;
      this._msgLote.enviarMensagemLote(this.formMsgLote.value).subscribe((res) => {
        if(res) {
          this._alert.success(res.msg);
          this.fechar();
          this.loadingMin = false;
        }else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      }, (error) => {
        this.loadingMin = false;
        this._alert.warning(error);
      });
    } else {
      this.loadingMin = false;
      this._alert.warning("Preencha todos os campos obrigatórios.");
    }
  }

  public selecionarFila(idFila: string): void {
    const filaSelecionada = this.filas.find(fila => fila.id_fila === Number(idFila));
    if (filaSelecionada) {
      this.formFila.patchValue({
        id_fila: filaSelecionada.id_fila,
        id_usuario: filaSelecionada.id_usuario
      });
      this.idUsuario = filaSelecionada.id_usuario; // Atualiza o idUsuario com base na fila selecionada
    }
  }

  public enviarClienteParaFila() {
    if (this.formFila.valid) {
      this._carteira.enviarClienteParaFila(this.formFila.value).subscribe((res) => {
        this._alert.success(res.msg);
        this._modal.dismissAll();
      }, (error) => {
        this._alert.warning(error);
      });
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios.");
    }
  }

  public calcularTotalClientes(): void {
    const idsUnicos = new Set(this.carteiraDeClientes.map(cliente => cliente.id_cliente));
    this.totalClientes = idsUnicos.size;
  }

  public calcularValorTotal(): void {
    this.valorTotal = this.carteiraDeClientes.reduce((total, cliente) => total + (cliente.valor_total_divida || 0), 0);
  }

  public obterCarteiradeCliente(): void {
    if (this.formCarteiraCliente.valid) {
      this.loading = true;
      const dadosParaEnvio = { ...this.formCarteiraCliente.value };

      dadosParaEnvio.periodo_vencimento_inicial = this._datePipe.transform(dadosParaEnvio.periodo_vencimento_inicial, "dd/MM/yyyy") || "";
      dadosParaEnvio.periodo_vencimento_final = this._datePipe.transform(dadosParaEnvio.periodo_vencimento_final, "dd/MM/yyyy") || "";

      dadosParaEnvio.periodo_importacao_inicial = this._datePipe.transform(dadosParaEnvio.periodo_importacao_inicial, "dd/MM/yyyy") || "";
      dadosParaEnvio.periodo_importacao_final = this._datePipe.transform(dadosParaEnvio.periodo_importacao_final, "dd/MM/yyyy") || "";

      this._carteira.obterCarteiradeCliente(dadosParaEnvio).subscribe((res) => {
        if (res.success === "true") {
          this.carteiraDeClientes = res.clientes;
          this.calcularTotalClientes(); // Calcula o total de IDs de clientes
          this.calcularValorTotal(); // Calcula o valor total
          this.filtrar();
          this.ativaAba = 2;
          this.obterFilas();
          this.loading = false;
        } else {
          this.loading = false;
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this.loading = false;
          this._alert.error("Ocorreu um erro ao filtra os clientes.", error);
        });
    } else {
      this._alert.warning("O campo 'Contratante' é obrigatório.");
    }
  }

  public filtrar(): void {
    this.dadosFiltrados = Utils.filtrar(this.carteiraDeClientes, this.textoPesquisa);
  }

  public dataBrasil(data) {
    return Utils.dataBrasil(data);
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }

  toggleCheckbox(tipo: string): void {
    if (tipo === 'sms') {
      this.formMsgLote.patchValue({
        enviar_sms: true,
        enviar_whatsapp: false
      });
    } else if (tipo === 'whatsapp') {
      this.formMsgLote.patchValue({
        enviar_sms: false,
        enviar_whatsapp: true
      });
    }
  }

  public fechar() {
    this.formMsgLote.reset();
    this._modal.dismissAll();
  }
}
