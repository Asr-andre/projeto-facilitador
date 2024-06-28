import { Component, Input, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcionamentoModel, ClienteModel } from 'src/app/core/models/acionamento.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acionamento',
  templateUrl: './acionamento.component.html',
  styleUrl: './acionamento.component.scss'
})
export class AcionamentoComponent {
  @Input() devedorId: number | null = null;
  public AcionamentosDoDevedor: AcionamentoModel[] = [];

  constructor(
    private _dashboard: DashboardService,
    private _modalService: NgbModal
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['devedorId'] && this.devedorId !== null) {
      this.obterAcionamento(this.devedorId);
    }
  }

  public obterAcionamento(devedorId: number): void {
    this._dashboard.obterAcionamentosDoDevedor(devedorId).subscribe(
      (devedor: ClienteModel) => {
        this.AcionamentosDoDevedor = devedor.acionamentos;
      },
      (error) => {
        Swal.fire({
          title: 'Aviso!',
          text: 'Não foi possível localizar os acionamentos!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#5438dc',
          cancelButtonColor: '#ff3d60'
        });
      }
    );
  }

  /**
   * Open center modal
   * @param acionamento
   */
  public AbrirModalcadastrar(acionamento: any) {
    this._modalService.open(acionamento, { centered: false });
  }

}
