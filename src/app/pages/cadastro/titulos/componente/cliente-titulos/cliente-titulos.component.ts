import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ClienteTituloService } from 'src/app/core/services/cadastro/cliente.titulos.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ClienteTitulosModel } from 'src/app/core/models/cadastro/cliente.titulos.model';

@Component({
  selector: 'app-cliente-titulos',
  templateUrl: './cliente-titulos.component.html',
  styleUrls: ['./cliente-titulos.component.scss']
})
export class ClienteTitulosComponent implements OnChanges {
  @Input() idCliente: number;
  public titulos: any[] = [];

  @ViewChild("tabelaClienteTitulos") tabelaClienteTitulos: ElementRef;

  constructor(
    private _clienteTituloService: ClienteTituloService,
    private _authService: AuthenticationService,
    private _alertService: AlertService
  ) {
    this.adicionarNovaLinha();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idCliente'] && changes['idCliente'].currentValue) {
      console.log('Recebido idCliente no ClienteTitulosComponent:', this.idCliente);
    }
  }

  public importarTitulos(): void {
    console.log('Método importarTitulo chamado');

    const linhas = this.tabelaClienteTitulos.nativeElement.querySelectorAll('tbody tr');
    if (linhas.length > 0) {
      const titulos = [];
      linhas.forEach(linha => {
        titulos.push({
          parcela: linha.querySelector('.parcela').textContent.trim(),
          plano: linha.querySelector('.plano').textContent.trim(),
          numero_contrato: linha.querySelector('.numero_contrato').textContent.trim(),
          numero_documento: linha.querySelector('.numero_documento').textContent.trim(),
          vencimento: linha.querySelector('.vencimento').textContent.trim(),
          tipo_produto: linha.querySelector('.tipo_produto').textContent.trim(),
          valor: linha.querySelector('.valor').textContent.trim(),
          id_empresa: Number(this._authService.getIdEmpresa()),
          id_contratante: Number(this._authService.getIdEmpresa()),
          id_cliente: Number(this.idCliente),
          user_login: this._authService.getLogin()
        });
      });

      if (titulos.length > 0) {
        this._clienteTituloService.cadastrarTitulos(titulos).subscribe(
          (res) => {
            if (res && res.success === 'true') {
              this._alertService.success(res.msg);
            }
          },
          (error) => {
            this._alertService.error("Erro ao cadastrar título", error);
            if (error.error && error.error.message) {
              this._alertService.warning("Detalhes do erro:", error.error.message);
            }
          }
        );
      } else {
        this._alertService.error("Nenhuma linha encontrada na tabela.");
      }
    } else {
      this._alertService.warning("Nenhuma linha encontrada na tabela.");
    }
  }

  public aoPressionarEnter(evento: KeyboardEvent, indiceLinha: number, indiceColuna: number) {
    if (evento.key === "Enter") {
      if (indiceColuna === 6 && indiceLinha === this.titulos.length - 1) {
        this.adicionarNovaLinha();
        setTimeout(() => {
          const elementoTabela = this.tabelaClienteTitulos.nativeElement as HTMLTableElement;
          const linhas = elementoTabela.rows;
          const novaLinha = linhas[linhas.length - 1];
          const primeiraCelula = novaLinha.cells[0] as HTMLElement;
          primeiraCelula.focus();
        });
      }
    }
  }

  public colarDados(evento: ClipboardEvent): void {
    evento.preventDefault();
    const dadosClipboard = evento.clipboardData;
    const linhasCopiadas = dadosClipboard.getData('text').split('\n');

    for (let i = 0; i < linhasCopiadas.length; i++) {
      const dadosLinha = linhasCopiadas[i].split('\t');
      if (dadosLinha.length === 7) {
        this.titulos[i] = {
          parcela: dadosLinha[0].trim(),
          plano: dadosLinha[1].trim(),
          numero_contrato: dadosLinha[2].trim(),
          numero_documento: dadosLinha[3].trim(),
          vencimento: dadosLinha[4].trim(),
          tipo_produto: dadosLinha[5].trim(),
          valor: dadosLinha[6].trim()
        };
      }
    }
  }

  public gerarParcelas(): void {
    const quantidadeParcelas = parseInt((document.getElementById('quantidadeParcelas') as HTMLInputElement).value, 10);

    if (isNaN(quantidadeParcelas) || quantidadeParcelas <= 0) {
      this._alertService.warning("Insira um número válido de parcelas.");
      return;
    }

    const ultimaParcela = this.titulos.length > 0 ? parseInt(this.titulos[this.titulos.length - 1].parcela, 10) : 0;
    const vencimentoInicial = new Date(this.titulos[this.titulos.length - 1]?.vencimento ?? new Date());

    for (let i = 1; i <= quantidadeParcelas; i++) {
      const novaParcela = ultimaParcela + i;

      const novoVencimento = new Date(vencimentoInicial);
      novoVencimento.setMonth(vencimentoInicial.getMonth() + i);

      this.titulos.push({
        parcela: novaParcela.toString(),
        plano: this.titulos[this.titulos.length - 1]?.plano ?? "",
        numero_contrato: this.titulos[this.titulos.length - 1]?.numero_contrato ?? "",
        numero_documento: this.titulos[this.titulos.length - 1]?.numero_documento ?? "",
        tipo_produto: this.titulos[this.titulos.length - 1]?.tipo_produto ?? "",
        vencimento: novoVencimento.toLocaleDateString(),
        valor: this.titulos[this.titulos.length - 1]?.valor ?? ""
      });
    }
  }


  private adicionarNovaLinha() {
    this.titulos.push({
      parcela: "",
      plano: "",
      numero_contrato: "",
      numero_documento: "",
      vencimento: "",
      tipo_produto: "",
      valor: ""
    });
  }
}
