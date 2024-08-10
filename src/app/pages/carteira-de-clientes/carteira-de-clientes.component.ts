import { DatePipe } from "@angular/common";
import { Component, OnInit, QueryList, TemplateRef, ViewChildren } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  compararParaOrdenar,
  OrdenarPeloHeaderTabela,
  SortEvent,
} from "src/app/core/helpers/conf-tabela/ordenacao-tabela";
import { Utils } from "src/app/core/helpers/utils";
import { ContratanteModel } from "src/app/core/models/cadastro/contratante.model";
import { CarteiraClienteModel } from "src/app/core/models/carteira.de.cliente.model";
import { FilaModel, FilaRequisicaoModel } from "src/app/core/models/fila.model";
import { AlertService } from "src/app/core/services/alert.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { ContratanteService } from "src/app/core/services/cadastro/contratante.service";
import { CarteiraDeClienteService } from "src/app/core/services/carteira.de.cliente.service";
import { FilaService } from "src/app/core/services/fila.service";

@Component({
  selector: "app-carteira-de-clientes",
  templateUrl: "./carteira-de-clientes.component.html",
  styleUrl: "./carteira-de-clientes.component.scss",
})
export class CarteiraDeClientesComponent implements OnInit {
  public contratantes: ContratanteModel[] = [];
  public formCarteiraCliente: FormGroup;
  public formFila: FormGroup;
  public carteiraDeClientes: CarteiraClienteModel[] = [];
  public idEmpresa = Number(this._authenticationService.getIdEmpresa());
  public contratanteSelecionado: number;
  public login = this._authenticationService.getLogin();
  public filtros: boolean = false;
  public loading: boolean =false;
  public ativaAba: number = 1;
  public selecionarTodos: boolean = false;
  public clienteSelecionado: CarteiraClienteModel | null = null;
  public filas: FilaModel[]=[];
  public idUsuario: number | null = null;

  public dadosFiltrados: CarteiraClienteModel[] = [];
  public textoPesquisa: string = "";
  public totalRegistros: number = 0;

  constructor(
    private _contratanteService: ContratanteService,
    private _carteiraDeClienteService: CarteiraDeClienteService,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService,
    private _formBuilder: FormBuilder,
    private _datePipe: DatePipe,
    private _modalService: NgbModal,
    private _filaService: FilaService,
  ) { }

  ngOnInit(): void {
    this.obterContratantes();
    this.iniciarForm();
    this.iniciarFormFila();
  }

  public iniciarForm(): void {
    this.formCarteiraCliente = this._formBuilder.group({
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
    this.formFila = this._formBuilder.group({
      id_empresa: [this.idEmpresa, Validators.required],
      id_fila:["", Validators.required],
      id_usuario: [this.idUsuario],
      user_login: [this.login, Validators.required],
      clientes: [""],
    });
  }

  public obterContratantes() {
    this.loading = true;
    this._contratanteService.obterContratantePorEmpresa(this.idEmpresa).subscribe((res) => {
      this.contratantes = res.contratantes;
      this.loading = false;
    },
      (error) => {
        this._alertService.error("Ocorreu um erro ao obter os contratantes.");
        this.loading = false;
      }
    );
  }

  public obterFilas() {
    const requisicao: FilaRequisicaoModel = {
     id_empresa: this.idEmpresa,
     user_login: this.login
    }

    this._filaService.obterFilas(requisicao).subscribe((res) => {
      this.filas = res.filas;
      this.loading = false;
    });
  }

  marcaTodos(event: any) {
    this.selecionarTodos = event.target.checked;
    this.dadosFiltrados.forEach(cliente => {
      cliente.selecionado = this.selecionarTodos;
    });
  }

  verificarSelecao() {
    this.selecionarTodos = this.dadosFiltrados.every(cliente => cliente.selecionado);
  }


  public ativarAba(aba: number): void {
    this.ativaAba = aba;
  }

  public abrirModalFila(content: TemplateRef<any>): void {
    const idsClientesSelecionados = this.dadosFiltrados
      .filter(cliente => cliente.selecionado)
      .map(cliente => cliente.id_cliente);

    this.formFila.patchValue({
      clientes: idsClientesSelecionados.join(',')
    });

    this._modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
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
      this._carteiraDeClienteService.enviarClienteParaFila(this.formFila.value).subscribe((res) => {
        this._alertService.success(res.msg);
        this._modalService.dismissAll();
      }, (error) => {
        this._alertService.warning(error);
      });
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios.");
    }
  }

  public obterCarteiradeCliente(): void {
    if (this.formCarteiraCliente.valid) {
      this.loading = true;
      const dadosParaEnvio = { ...this.formCarteiraCliente.value };

      dadosParaEnvio.periodo_vencimento_inicial = this._datePipe.transform(dadosParaEnvio.periodo_vencimento_inicial, "dd/MM/yyyy") || "";
      dadosParaEnvio.periodo_vencimento_final = this._datePipe.transform(dadosParaEnvio.periodo_vencimento_final, "dd/MM/yyyy") || "";

      dadosParaEnvio.periodo_importacao_inicial = this._datePipe.transform(dadosParaEnvio.periodo_importacao_inicial, "dd/MM/yyyy") || "";
      dadosParaEnvio.periodo_importacao_final = this._datePipe.transform(dadosParaEnvio.periodo_importacao_final, "dd/MM/yyyy") || "";

      this._carteiraDeClienteService.obterCarteiradeCliente(dadosParaEnvio).subscribe((res) => {
        if (res.success === "true") {
          this.carteiraDeClientes = res.clientes;
          this.filtrar();
          this.ativaAba = 2;
          this.obterFilas();
          this.loading = false;
        } else {
          this.loading = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loading = false;
          this._alertService.error("Ocorreu um erro ao filtra os clientes.", error);
        });
    } else {
      this._alertService.warning("O campo 'Contratante' é obrigatório.");
    }
  }

  public dataBrasil(data) {
    return Utils.dataBrasil(data);
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }

  public filtrar(): void {
    this.dadosFiltrados = Utils.filtrar(this.carteiraDeClientes, this.textoPesquisa);
  }
}
