import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, debounceTime } from 'rxjs';
import { AcionamentoModel, RequisicaoAcionamentoModel } from 'src/app/core/models/acionamento.model';
import { AcionamentoService } from 'src/app/core/services/acionamento.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-acionamento',
  templateUrl: './acionamento.component.html',
  styleUrl: './acionamento.component.scss'
})
export class AcionamentoComponent implements OnChanges {
  @Input() idCliente: number | undefined;
  @Input() idContratante: number | undefined;
  public idEmpresa: number = Number(this._authService.getIdEmpresa() || 0);
  public acionamentos: AcionamentoModel[] = [];
  public loadingMin: boolean = false;

  private updateSubject: Subject<void> = new Subject<void>();


  constructor(
    private _alertService: AlertService,
    private _modalService: NgbModal,
    private _authService: AuthenticationService,
    private _acionamentoService: AcionamentoService
  ) {
    this.updateSubject.pipe(debounceTime(300)).subscribe(() => this.listarAcionamentos());
   }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente || changes.idContratante) {
      this.updateSubject.next();
    }
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
            this.acionamentos =res.acionamentos;
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
}
