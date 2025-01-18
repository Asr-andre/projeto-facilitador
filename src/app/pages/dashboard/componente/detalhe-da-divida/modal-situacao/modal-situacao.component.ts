import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SituacaoModel } from 'src/app/core/models/situacao.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { SituacaoService } from 'src/app/core/services/situacao.service';

@Component({
  selector: 'app-modal-situacao',
  templateUrl: './modal-situacao.component.html',
  styleUrl: './modal-situacao.component.scss'
})
export class ModalSituacaoComponent implements OnInit, OnChanges {
  @ViewChild("modalSituacao") modalSituacao: any;
  @Input() idCliente: number | undefined;
  @Input() clienteSituacao: string | undefined;
  @Output() clienteAtualizado = new EventEmitter<void>();
  public login = this._auth.getLogin();
  public situacao: SituacaoModel[] = [];
  public loadingMin: boolean = false;
  public formSituacao: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _auth: AuthenticationService,
    private _modalService: NgbModal,
    private _situacaoService: SituacaoService,
    private _alert: AlertService,
  ) { }

  ngOnInit(): void {

  }

  public inicializarForm() {
    this.formSituacao = this._formBuilder.group({
      id_cliente: [''],
      situacao: [this.clienteSituacao],
      user_login: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.inicializarForm();
    if (changes['clienteSituacao'] && changes['clienteSituacao'].currentValue !== undefined) {
      this.formSituacao.patchValue({ situacao: changes['clienteSituacao'].currentValue });
    }
  }

  public abriModalSituacao() {
    this.obterSituacao();
    this.formSituacao.patchValue({
      id_cliente: this.idCliente,
      situacao: this.clienteSituacao,
      user_login: this.login,
    });

    this._modalService.open(this.modalSituacao, { size: "sm", ariaLabelledBy: "modal-basic-title", backdrop: "static", keyboard: false, });
  }

  public obterSituacao() {
    const requisicao = {
      user_login: this.login
    }

    if (!requisicao) {
      this._alert.warning('O id do usuário não foi localizado.');
      return;
    }

    this.loadingMin = true;
    this._situacaoService.obterSituacao(requisicao).subscribe((res) => {
      if (res.success == 'true') {
        this.situacao = res.dados;
        this.loadingMin = false;
      } else {
        this.loadingMin = false;
        this._alert.warning(res.msg);
      }
    },
      (error) => {
        this.loadingMin = false;
        this._alert.error('Ocorreu um erro ao tentar editar o processo.');
      });
  }

  public atualizarSituacao() {
       if (!this.formSituacao.value) {
      this._alert.warning('Algo deu errado, verifique o log.');
      return;
    }

    this.loadingMin = true;
    this._situacaoService.atualizarSituacao(this.formSituacao.value).subscribe((res) => {
      if (res.success == 'true') {
        this.loadingMin = false;
        this.fechar();
        this.clienteAtualizado.emit();
      } else {
        this.loadingMin = false;
        this._alert.warning(res.msg);
      }
    },
      (error) => {
        this.loadingMin = false;
        this._alert.error('Ocorreu um erro ao tentar editar o processo.');
      });
  }

  public fechar() {
    this.formSituacao.reset();
    this._modalService.dismissAll();
  }
}
