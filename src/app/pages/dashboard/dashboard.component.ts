import { Component, OnInit, ViewChild } from '@angular/core';
import { DevedorModel } from 'src/app/core/models/devedor.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DetalhamentoModel } from 'src/app/core/models/detalhamento.model';
import Swal from 'sweetalert2';
import { WhatsappComponent } from './componente/whatsapp/whatsapp.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  @ViewChild(WhatsappComponent) whatsappComponent: WhatsappComponent;
  public listarDevedores: DevedorModel[] = [];
  public devedoresFiltrados: DevedorModel[] = [];
  public textoPequisa: string = '';
  public paginaAtual: number = 1;
  public itensPorPagina: number = 10;
  public devedorSelecionado: DevedorModel | null = null;
  public detalhamentoSelecionado: DetalhamentoModel | null = null;
  public loading = true;

  constructor(
    private _dashboard: DashboardService
  ) { }

  ngOnInit(): void {
    this.obterDevedores();

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  public obterDevedores() {
    this._dashboard.obterDevedores().subscribe((res) => {
      this.listarDevedores = res;
      this.devedoresFiltrados = res;
    });
  }

  public obterDevedorPorId(id: number): void {
    this._dashboard.obterDevedorPorId(id).subscribe((devedor) => {
        this.devedorSelecionado = devedor;
        this.obterDetalhamentoPorId(id);
      },
      (error) => {
        Swal.fire({
          title: 'Aviso!',
          text: 'Não foi possivel pesquisar o devedor!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#5438dc',
          cancelButtonColor: '#ff3d60'
        });
      }
    );
  }

  public selecionarDevedor(devedor: DevedorModel): void {
    this.devedorSelecionado = devedor;
    this.obterDetalhamentoPorId(devedor.id_cliente);
  }

  public obterDetalhamentoPorId(id: number): void {
    this._dashboard.obterDetalhamentoPorId(id).subscribe((detalhamento) => {
      if (detalhamento) {
        this.detalhamentoSelecionado = detalhamento;
      }
    },
      (error) => {
        Swal.fire({
          title: 'Aviso!',
          text: 'Não foi possivel selecionar o devedor!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#5438dc',
          cancelButtonColor: '#ff3d60'
        });
      }
    );
  }

  public calcularTotal(coluna: string): number {
    if (this.detalhamentoSelecionado?.prestacoes) {
      return this.detalhamentoSelecionado.prestacoes.reduce((total, prestacao) => total + prestacao[coluna], 0);
    }
    return 0;
  }

  public filtraDevedor(): void {
    const pesquisa = this.textoPequisa.toLowerCase();
    this.devedoresFiltrados = this.listarDevedores.filter(devedor =>
      devedor.id_cliente.toString().toLowerCase().includes(pesquisa) ||
      devedor.cnpj_cpf.toLowerCase().includes(pesquisa) ||
      devedor.fantasia.toLowerCase().includes(pesquisa) ||
      devedor.nome.toLowerCase().includes(pesquisa) ||
      devedor.saldo_devedor.toString().toLowerCase().includes(pesquisa)
    );
  }

  public openWhatsappModal(telefone: string): void {
    this.whatsappComponent.abrirModalWhatsapp(telefone);
  }
}
