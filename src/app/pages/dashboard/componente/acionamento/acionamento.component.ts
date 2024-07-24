import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { utils } from 'protractor';
import { Subject, debounceTime } from 'rxjs';
import { Utils } from 'src/app/core/helpers/utils';
import { AcionamentoModel, RequisicaoAcionamentoModel } from 'src/app/core/models/acionamento.model';
import { AcaoCobrancaModel, RequisicaoAcaoCobrancaModel } from 'src/app/core/models/acoes.cobranca.model';
import { AcaoCobrancaService } from 'src/app/core/services/acao.cobranca.service';
import { AcionamentoService } from 'src/app/core/services/acionamento.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-acionamento',
  templateUrl: './acionamento.component.html',
  styleUrl: './acionamento.component.scss'
})
export class AcionamentoComponent implements OnChanges, OnInit {
  @ViewChild('acaoDeCobrancaModal') modalEmailRef: TemplateRef<any>;
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public acionamentos: AcionamentoModel[] = [];
  public acoesCobranca: AcaoCobrancaModel[] = [];
  public loadingMin: boolean = false;
  public formAcionamento: FormGroup;

  private updateSubject: Subject<void> = new Subject<void>();


  constructor(
    private _alertService: AlertService,
    private _modalService: NgbModal,
    private _authService: AuthenticationService,
    private _acionamentoService: AcionamentoService,
    private _acaoCobrancaService: AcaoCobrancaService,
    private _formBuilder: FormBuilder
  ) {
    this.updateSubject.pipe(debounceTime(500)).subscribe(() => this.listarAcionamentos());
  }

  ngOnInit(): void {
    this.inicializarformAcionamentos();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idCliente'] || changes['idContratante']) {
      this.updateSubject.next();
    }
  }

  public inicializarformAcionamentos() {
    this.formAcionamento = this._formBuilder.group({
      id_empresa: [this.idEmpresa],
      id_contratante: [this.idContratante],
      id_cliente: [this.idCliente],
      id_acao: [],
      mensagem: [""],
      user_login: [this._authService.getLogin()],
    });
  }

  public listarAcionamentos(): void {
    if (this.idCliente && this.idContratante) {
      this.loadingMin = true;
      const requisicao: RequisicaoAcionamentoModel = {
        id_empresa: this.idEmpresa,
        id_contratante: this.idContratante,
        id_cliente: this.idCliente
      };

      this._acionamentoService.listarAcionamentos(requisicao).subscribe((res) => {
        if (res.success) {
          this.acionamentos = res.acionamentos;
          this.loadingMin = false;
        } else {
          this.loadingMin = false;
          this._alertService.error(res.msg);
        }
      },
        (error) => {
          this.loadingMin = false;
          this._alertService.error('Erro ao listar acionamentos');
        }
      );
    }
  }

  public listarAcoesCobranca(): void {
    if (this.idEmpresa ) {
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
          this._alertService.error('Erro ao listar ações de cobrança');
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
      id_contratante: this.idContratante
    });

    this._modalService.open(this.modalEmailRef, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  }

  public enviarAcionamento(): void {
    const acionamento = this.formAcionamento.value;
    this._acionamentoService.inserirAcionamento(acionamento).subscribe((res) => {
      if (res.success) {
        this._alertService.success('Acionamento inserido com sucesso');
        this.listarAcionamentos();
        this.resetarCampos();
        this._modalService.dismissAll();
      } else {
        this._alertService.error(res.msg);
      }
    },
      (error) => {
        this._alertService.error('Erro ao inserir acionamento');
      }
    );
  }

  private resetarCampos() {
    this.formAcionamento.patchValue({
      mensagem: '',
    });
  }
}
