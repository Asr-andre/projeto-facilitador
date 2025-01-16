import { Component, ViewChild } from '@angular/core';
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
export class ModalSituacaoComponent {
  @ViewChild("modalSituacao") modalSituacao: any;
  public login = this._auth.getLogin();
  public situacao: SituacaoModel []=[];
  public loadingMin: boolean =false;

constructor(
  private _auth: AuthenticationService,
  private _modalService: NgbModal,
  private _situacaoService: SituacaoService,
  private _alert: AlertService,
  ) { }

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
      if(res.success == 'true') {
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

  public abriModalSituacao() {
    this.obterSituacao();
    this._modalService.open(this.modalSituacao, { size: "sm", ariaLabelledBy: "modal-basic-title", backdrop: "static", keyboard: false, });
  }

  public fechar() {
    this._modalService.dismissAll();
  }
}
