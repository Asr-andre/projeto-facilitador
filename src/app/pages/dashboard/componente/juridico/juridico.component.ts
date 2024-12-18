import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from 'src/app/core/helpers/utils';
import { ProcessoModel } from 'src/app/core/models/juridico.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { JuridicoService } from 'src/app/core/services/juridico.service';

@Component({
  selector: 'app-juridico',
  templateUrl: './juridico.component.html',
  styleUrl: './juridico.component.scss'
})
export class JuridicoComponent implements OnInit, OnChanges {
  @Input() idCliente: number | undefined;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();
  public loadingMin: boolean =false;
  public processos: ProcessoModel [] = [];
  public editar: boolean = false;
  public formProcesso: FormGroup;
  public movimentacao: string  [] = [];

  constructor(
    private _juridico: JuridicoService,
    private _auth: AuthenticationService,
    private _alert: AlertService,
    private _formBuilder: FormBuilder,
    private _modal: NgbModal,
    private _datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.obterProcessos();
    this.inicializarFormProcesso();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente && !changes.idCliente.firstChange) {
      this.obterProcessos();
    }
  }

  public inicializarFormProcesso(dado?: ProcessoModel) {
    this.formProcesso = this._formBuilder.group({
      id_processo: [dado?.id_processo],
      id_empresa: [this.idEmpresa],
      id_cliente: [this.idCliente],
      numero_processo: [dado?.numero_processo, Validators.required],
      data_entrada_processo: [dado?.data_entrada_processo || ""],
      tipo_acao: [dado?.tipo_acao || ""],
      comarca: [dado?.comarca || ""],
      vara: [dado?.vara || ""],
      adv_causa: [dado?.adv_causa || ""],
      adv_contrario: [dado?.adv_contrario || ""],
      data_audiencia: [dado?.data_audiencia || ""],
      ultimo_andamento: [dado?.ultimo_andamento || ""],
      obs: [dado?.obs || ""],
      user_login: [this.login]
    });
  }

  public controleBotao() {
    if(this.editar == false) {
      this.cadastrarProcesso();
    } else {
      this.editarProcesso();
    }
  }

  public obterProcessos() {
    const request = {
      id_empresa: this.idEmpresa,
      id_cliente: this.idCliente,
      user_login: this.login
    };

    this.loadingMin = true;
    this._juridico.obterProcessos(request).subscribe((res) => {
      if (res.success === 'true') {
        this.processos = res.processos;
        this.loadingMin = false;
      } else {
        this.loadingMin = false;
        this._alert.warning(res.msg);
      }
    },
      (error) => {
        this.loadingMin = false;
        this._alert.error('Erro ao obter os boletos.',error);
      }
    );
  }

  public obterMovimentacao() {
    const request = {
      id_empresa: this.idEmpresa,
      user_login: this.login
    };

    this._juridico.obterMovimento(request).subscribe((res) => {
      if (res.success === 'true') {
        this.movimentacao = res.dados;
      } else {
        this._alert.warning(res.msg);
      }
    });
  }

  public abriModalCadastrar(content: TemplateRef<any>): void {
    this.editar = false;
    this.obterMovimentacao();
    this.inicializarFormProcesso();
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public abriModalEditar(content: TemplateRef<any>, dados: ProcessoModel): void {
    this.editar = true;
    this.obterMovimentacao();
    this.inicializarFormProcesso(dados);
    this._modal.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarProcesso(): void {
    if (this.formProcesso.valid) {

      const dadosParaEnvio = { ...this.formProcesso.value };
      dadosParaEnvio.data_audiencia = this._datePipe.transform(dadosParaEnvio.data_audiencia, "dd/MM/yyyy HH:mm:ss") || "";
      dadosParaEnvio.data_entrada_processo = this._datePipe.transform(dadosParaEnvio.data_entrada_processo, "dd/MM/yyyy") || "";

      this.loadingMin = true;
      this._juridico.cadastrarProcesso(dadosParaEnvio).subscribe((res) => {
        if (res.success === 'true') {
          this.obterProcessos();
          this.fechar();
          this._alert.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alert.error('Ocorreu um erro ao tentar editar o processo.');
        }
      );
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public editarProcesso(): void {
    if (this.formProcesso.valid) {

      const dadosParaEnvio = { ...this.formProcesso.value };
      dadosParaEnvio.data_audiencia = this._datePipe.transform(dadosParaEnvio.data_audiencia, "dd/MM/yyyy HH:mm:ss") || "";
      dadosParaEnvio.data_entrada_processo = this._datePipe.transform(dadosParaEnvio.data_entrada_processo, "dd/MM/yyyy") || "";

      this.loadingMin = true;
      this._juridico.editarProcesso(dadosParaEnvio).subscribe((res) => {
        if (res.success === 'true') {
          this.obterProcessos();
          this.fechar();
          this._alert.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alert.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alert.error('Ocorreu um erro ao tentar editar o processo.');
        }
      );
    } else {
      this._alert.warning("Preencha todos os campos obrigatórios");
    }
  }

  public fechar() {
    this.formProcesso.reset();
    this._modal.dismissAll();
  }

  formatToBR(date: string | null): string {
    if (!date) return '';

    // Dividir a string de data ISO e usar apenas a parte da data
    const [year, month, day] = date.split('T')[0].split('-');
    return `${day}/${month}/${year}`; // Formato dd/MM/yyyy
  }


  formatarNumeroProcesso(numero: string): string {
    if (!numero) return '';

    // Ajustando o regex para incluir o novo formato
    const regex = /^(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})$/;
    const match = numero.match(regex);

    if (match) {
      return `${match[1]}-${match[2]}.${match[3]}.${match[4]}.${match[5]}.${match[6]}`;
    }

    return numero;
  }

  public data(data) {
      return Utils.formatarDataParaExibicao(data);
    }
}
