import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { compararParaOrdenar, OrdenarPeloHeaderTabela, SortEvent } from 'src/app/core/helpers/conf-tabela/ordenacao-tabela';
import { BoletoPixModel } from 'src/app/core/models/boletopix.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { BoletoPixService } from 'src/app/core/services/boletopix.service';

@Component({
  selector: 'app-boleto-pix',
  templateUrl: './boleto-pix.component.html',
  styleUrl: './boleto-pix.component.scss'
})
export class BoletoPixComponent implements OnInit, OnChanges {
  @Input() idCliente: number | undefined;
  public idEmpresa: number = Number(this._auth.getIdEmpresa() || 0);
  public login = this._auth.getLogin();
  public loadingMin: boolean =false;
  public boletos: BoletoPixModel[] = [];

  public dadosFiltrados: BoletoPixModel[] = [];
  public textoPesquisa: string = "";
  public direcaoOrdenacao: { [key: string]: string } = {};
  @ViewChildren(OrdenarPeloHeaderTabela) headers: QueryList<OrdenarPeloHeaderTabela<BoletoPixModel>>;

  constructor(
    private _boletoPix: BoletoPixService,
    private _auth: AuthenticationService,
    private _alert: AlertService,
  ) { }

  ngOnInit(): void {
    this.obterBoeltoPix();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente && !changes.idCliente.firstChange) {
      this.obterBoeltoPix();
    }
  }

  public obterBoeltoPix() {
    if (!this.idCliente) return;

    const request = {
      id_cliente: this.idCliente!,
      id_empresa: this.idEmpresa,
      user_login: this.login
    };

    this.loadingMin = true;
    this._boletoPix.obterBoletoPix(request).subscribe((res) => {
      if (res.success === 'true') {
        this.boletos = res.boletos;
        this.dadosFiltrados = res.boletos;
        this.loadingMin = false;
      } else {
        this._alert.warning(res.msg);
      }
    },
      (error) => {
        this.loadingMin = false;
        this._alert.error('Erro ao obter os boletos.',error);
      }
    );
  }

  public ordenar({ column, direction }: SortEvent<BoletoPixModel>) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.dadosFiltrados = this.boletos;
    } else {
      this.dadosFiltrados = [...this.dadosFiltrados].sort((a, b) => {
        const res = compararParaOrdenar(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public situacao(situacao: string): string {
    switch (situacao) {
      case 'EXPIRADO':
        return 'Cancelado';
      case 'CONCLUIDA':
        return 'Pago';
      case 'ATIVA':
        return 'Em Aberto';
      default:
        return situacao;
    }
  }

  public executarAcao(pixcopiacola: string): void {
    if (pixcopiacola.startsWith('https')) {
      window.open(pixcopiacola, '_blank');
    } else {
      this.copiarParaAreaDeTransferencia(pixcopiacola);
    }
  }

  private copiarParaAreaDeTransferencia(texto: string): void {
    navigator.clipboard.writeText(texto).then(() => {
      this._alert.copiado();
    }).catch(err => {
      this._alert.error('Erro ao copiar o código Pix.', err);
    });
  }
}
