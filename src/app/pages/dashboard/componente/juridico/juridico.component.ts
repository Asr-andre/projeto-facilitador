import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from 'src/app/core/helpers/utils';
import { ProcessoModel } from 'src/app/core/models/juridico.model';
import { MovimentosResponseModel } from 'src/app/core/models/movimento.model';
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
    private _juridicoService: JuridicoService,
    private _auth: AuthenticationService,
    private _alertService: AlertService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private datePipe: DatePipe,
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
      data_entrada_processo: [
        dado?.data_entrada_processo
          ? this.datePipe.transform(dado.data_entrada_processo, 'dd/MM/yyyy')
          : this.datePipe.transform(new Date(), 'dd/MM/yyyy')
      ],
      tipo_acao: [dado?.tipo_acao || ""],
      comarca: [dado?.comarca || ""],
      vara: [dado?.vara || ""],
      adv_causa: [dado?.adv_causa || ""],
      adv_contrario: [dado?.adv_contrario || ""],
      data_audiencia: [
        dado?.data_audiencia
          ? this.datePipe.transform(dado.data_audiencia, 'dd/MM/yyyy')
          : this.datePipe.transform(new Date(), 'dd/MM/yyyy')
      ],
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
    this._juridicoService.obterProcessos(request).subscribe((res) => {
      if (res.success === 'true') {
        this.processos = res.processos;
        this.loadingMin = false;
      } else {
        this.loadingMin = false;
        this._alertService.warning(res.msg);
      }
    },
      (error) => {
        this.loadingMin = false;
        this._alertService.error('Erro ao obter os boletos.',error);
      }
    );
  }

  public obterMovimentacao() {
    const request = {
      id_empresa: this.idEmpresa,
      user_login: this.login
    };

    this._juridicoService.obterMovimento(request).subscribe((res) => {
      if (res.success === 'true') {
        this.movimentacao = res.dados;
        this.obterProcessos();
      } else {
        this._alertService.warning(res.msg);
      }
    });
  }

  public abriModalCadastrar(content: TemplateRef<any>): void {
    this.editar = false;
    this.obterMovimentacao();
    this.inicializarFormProcesso();
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public abriModalEditar(content: TemplateRef<any>, dados: ProcessoModel): void {
    this.editar = true;
    this.obterMovimentacao();
    this.inicializarFormProcesso(dados);
    this._modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }

  public cadastrarProcesso(): void {
    if (this.formProcesso.valid) {
      this.loadingMin = true;
      this._juridicoService.cadastrarProcesso(this.formProcesso.value).subscribe((res) => {
        if (res.success === 'true') {
          this.obterProcessos();
         this.fechar();
          this._alertService.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error('Ocorreu um erro ao tentar editar o processo.');
        }
      );
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public editarProcesso(): void {
    if (this.formProcesso.valid) {
      this.loadingMin = true;
      this._juridicoService.editarProcesso(this.formProcesso.value).subscribe((res) => {
        if (res.success === 'true') {
          this.obterProcessos();
         this.fechar();
          this._alertService.success(res.msg);
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alertService.warning(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error('Ocorreu um erro ao tentar editar o processo.');
        }
      );
    } else {
      this._alertService.warning("Preencha todos os campos obrigatórios");
    }
  }

  public fechar() {
    this.formProcesso.reset();
    this._modalService.dismissAll();
  }

  public data(data) {
    return Utils.formatarDataParaExibicao(data);
  }
}
