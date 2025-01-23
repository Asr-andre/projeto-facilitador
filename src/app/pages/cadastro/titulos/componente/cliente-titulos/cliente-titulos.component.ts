import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ClienteTituloService } from 'src/app/core/services/cadastro/cliente.titulos.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-cliente-titulos',
  templateUrl: './cliente-titulos.component.html',
  styleUrls: ['./cliente-titulos.component.scss']
})
export class ClienteTitulosComponent implements OnChanges {
  @Input() idCliente: number;
  @Input() idContratante: number;
  public titulos: any[] = [];
  public loading: boolean = false;

  @ViewChild("tabelaClienteTitulos") tabelaClienteTitulos: ElementRef;

  constructor(
    private _clienteTitulo: ClienteTituloService,
    private _auth: AuthenticationService,
    private _alert: AlertService
  ) {
    this.adicionarNovaLinha();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idCliente'] && changes['idCliente'].currentValue) {
    }
  }

  public importarTitulos(): void {
    const linhas = this.tabelaClienteTitulos.nativeElement.querySelectorAll('tbody tr');
    if (linhas.length > 0) {
      const titulos = [];
      let dadosValidos = true;

      linhas.forEach(linha => {
        const tipoTitulo = linha.querySelector('.tipo_titulo').innerText.trim();
        const parcela = linha.querySelector('.parcela').innerText.trim();
        const plano = linha.querySelector('.plano').innerText.trim();
        const numeroContrato = linha.querySelector('.numero_contrato').innerText.trim();
        const numeroDocumento = linha.querySelector('.numero_documento').innerText.trim();
        const produto = linha.querySelector('.produto').innerText.trim();
        const vencimento = linha.querySelector('.vencimento').innerText.trim();
        let valor = linha.querySelector('.valor').innerText.trim();

        valor = parseFloat(valor.replace(',', '.'));

        if (!tipoTitulo || !parcela || !plano || !numeroContrato || !numeroDocumento || !produto || !vencimento || !valor) {
          dadosValidos = false;
          return;
        }

        titulos.push({
          tipo_titulo: tipoTitulo,
          parcela: parcela,
          plano: plano,
          numero_contrato: numeroContrato,
          numero_documento: numeroDocumento,
          produto: produto,
          vencimento: vencimento,
          valor: valor.toFixed(2),
          id_empresa: Number(this._auth.getIdEmpresa()),
          id_contratante: Number(this.idContratante),
          id_cliente: Number(this.idCliente),
          user_login: this._auth.getLogin()
        });
      });

      if (dadosValidos) {
        this.salvarTitulos(titulos);
      } else {
        this._alert.error("Preencha corretamente todos os campos antes de importar os títulos.");
      }
    } else {
      this._alert.warning("Nenhuma linha encontrada na tabela.");
    }
  }

  private salvarTitulos(titulos: any[]): void {
    this.loading = true;
    this._clienteTitulo.cadastrarTitulos(titulos).subscribe((res) => {
      if (res && res.success === 'true') {
        this.loading = false
        this._alert.success(res.msg);
      }
    },
      (error) => {
        this.loading = false
        this._alert.error("Erro ao cadastrar título", error);
        if (error.error && error.error.message) {
          this.loading = false
          this._alert.warning("Detalhes do erro:", error.error.message);
        }
      }
    );
  }

  public aoPressionarEnter(evento: KeyboardEvent, indiceLinha: number, indiceColuna: number) {
    if (evento.key === "Enter") {
      if (indiceColuna === 7 && indiceLinha === this.titulos.length - 1) {
        this.adicionarNovaLinha();
        setTimeout(() => {
          const elementoTabela = this.tabelaClienteTitulos.nativeElement as HTMLTableElement;
          const linhas = elementoTabela.rows;
          const novaLinha = linhas[linhas.length - 1];
          const primeiraCelula = novaLinha.cells[0];
          primeiraCelula.focus();
        });
      }
    }
  }

  public colarDados(evento: ClipboardEvent): void {
    evento.preventDefault();
    this.titulos = [];

    const dadosClipboard = evento.clipboardData;
    const linhasCopiadas = dadosClipboard.getData('text').split('\n');

    for (let i = 0; i < linhasCopiadas.length; i++) {
      const dadosLinha = linhasCopiadas[i].split('\t');
      if (dadosLinha.length === 8) {
        this.titulos.push({
          tipo_titulo: dadosLinha[0].trim(),
          parcela: dadosLinha[1].trim(),
          plano: dadosLinha[2].trim(),
          numero_contrato: dadosLinha[3].trim(),
          numero_documento: dadosLinha[4].trim(),
          produto: dadosLinha[5].trim(),
          vencimento: dadosLinha[6].trim(),
          valor: dadosLinha[7].trim(),
          id_empresa: Number(this._auth.getIdEmpresa()),
          id_contratante: Number(this.idContratante),
          id_cliente: Number(this.idCliente),
          user_login: this._auth.getLogin()
        });
      }
    }
  }

  public gerarParcelas(): void {
    this.atualizarDadosDaTabela();

    if (this.titulos.length > 0 && this.titulos.every(titulo => this.camposPreenchidos(titulo))) {
      const quantidadeParcelas = parseInt((document.getElementById('quantidadeParcelas') as HTMLInputElement).value, 10);

      if (isNaN(quantidadeParcelas) || quantidadeParcelas <= 0) {
        this._alert.warning("Insira um número válido de parcelas.");
        return;
      }

      const ultimaParcela = this.titulos.length > 0 ? parseInt(this.titulos[this.titulos.length - 1].parcela, 10) : 0;
      let vencimentoInicial: Date;

      if (this.titulos.length > 0 && this.titulos[this.titulos.length - 1]?.vencimento) {
        const parts = this.titulos[this.titulos.length - 1].vencimento.split('/');
        vencimentoInicial = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      } else {
        vencimentoInicial = new Date();
      }

      if (isNaN(vencimentoInicial.getTime())) {
        this._alert.warning("Data de vencimento inicial inválida.");
        return;
      }

      const valorInicial = parseFloat(this.titulos[this.titulos.length - 1]?.valor ?? "0");
      const valorParcela = valorInicial;

      for (let i = 1; i <= quantidadeParcelas; i++) {
        const novaParcela = ultimaParcela + i;
        const novoVencimento = new Date(vencimentoInicial);
        novoVencimento.setMonth(vencimentoInicial.getMonth() + i);

        if (isNaN(novoVencimento.getTime())) {
          this._alert.warning(`Data de vencimento da parcela ${novaParcela} inválida.`);
          return;
        }

        const formattedDate = `${novoVencimento.getDate().toString().padStart(2, '0')}/${(novoVencimento.getMonth() + 1).toString().padStart(2, '0')}/${novoVencimento.getFullYear()}`;

        this.titulos.push({
          tipo_titulo: this.titulos[this.titulos.length - 1]?.tipo_titulo ?? "",
          parcela: novaParcela.toString(),
          plano: this.titulos[this.titulos.length - 1]?.plano ?? "",
          numero_contrato: this.titulos[this.titulos.length - 1]?.numero_contrato ?? "",
          numero_documento: this.titulos[this.titulos.length - 1]?.numero_documento ?? "",
          produto: this.titulos[this.titulos.length - 1]?.produto ?? "",
          vencimento: formattedDate,
          valor: valorParcela.toFixed(2)
        });
      }
    } else {
      this._alert.warning("Preencha corretamente todos os campos antes de gerar as parcelas.");
    }
  }

  private atualizarDadosDaTabela(): void {
    const linhas = this.tabelaClienteTitulos.nativeElement.querySelectorAll('tbody tr');
    this.titulos = [];

    linhas.forEach(linha => {
      const tipoTitulo = linha.querySelector('.tipo_titulo').innerText.trim();
      const parcela = linha.querySelector('.parcela').innerText.trim();
      const plano = linha.querySelector('.plano').innerText.trim();
      const numeroContrato = linha.querySelector('.numero_contrato').innerText.trim();
      const numeroDocumento = linha.querySelector('.numero_documento').innerText.trim();
      const produto = linha.querySelector('.produto').innerText.trim();
      const vencimento = linha.querySelector('.vencimento').innerText.trim();
      const valor = linha.querySelector('.valor').innerText.trim();

      this.titulos.push({
        tipo_titulo: tipoTitulo,
        parcela: parcela,
        plano: plano,
        numero_contrato: numeroContrato,
        numero_documento: numeroDocumento,
        produto: produto,
        vencimento: vencimento,
        valor: valor,
        id_empresa: Number(this._auth.getIdEmpresa()),
        id_contratante: Number(this.idContratante),
        id_cliente: Number(this.idCliente),
        user_login: this._auth.getLogin()
      });
    });
  }

  private adicionarNovaLinha(): void {
    this.titulos.push({
      tipo_titulo: '',
      parcela: '',
      plano: '',
      numero_contrato: '',
      numero_documento: '',
      produto: '',
      vencimento: '',
      valor: '',
      id_empresa: Number(this._auth.getIdEmpresa()),
      id_contratante: Number(this.idContratante),
      id_cliente: Number(this.idCliente),
      user_login: this._auth.getLogin()
    });
  }

  private camposPreenchidos(titulo: any): boolean {
    return titulo.tipo_titulo && titulo.parcela && titulo.plano && titulo.numero_contrato &&
      titulo.numero_documento && titulo.produto && titulo.vencimento && titulo.valor;
  }
}
