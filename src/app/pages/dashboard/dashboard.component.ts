
import { Component, OnInit } from "@angular/core";
import { Utils } from "src/app/core/helpers/utils";
import { RespostaCardsModel } from "src/app/core/models/cards.dashboard.model";
import { DevedorModel } from "src/app/core/models/devedor.model";
import { DashboardService } from "src/app/core/services/dashboard.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {

  public listarDevedores: DevedorModel[] = [];
  public devedoresFiltrados: DevedorModel[] = [];
  public dadosCards: RespostaCardsModel;
  public textoPesquisa: string = "";
  public paginaAtual: number = 1;
  public itensPorPagina: number = 20;
  public devedorSelecionado: DevedorModel | null = null;
  public loading: boolean = false;

  public qtdeEmail: number = 0;
  public totalEmail: number = 0;
  public qtdeSms: number = 0;
  public totalSms: number = 0;
  public qtdeWhatsapp: number = 0;
  public totalWhatsapp: number = 0;
  public totalUtilizado: number = 0;
  public saldo: number = 0;

  constructor(
    private _dashboard: DashboardService,
  ) { }

  ngOnInit(): void {
    this.obterDevedores();

  }

  public obterDevedores(): void {
    this.loading = true;
    this._dashboard.obterDevedores().subscribe((res) => {
      this.listarDevedores = res;
      this.devedoresFiltrados = res;
      this.obterDadosDosCards();
      this.loading = false;
    });
  }

  public obterDadosDosCards(): void {
    this._dashboard.obterCards().subscribe(
      (response: RespostaCardsModel) => {
        // Verifique se a resposta é válida e se contém as propriedades esperadas
        if (response && response.success !== undefined) {
          if (response.success === 'true' || response.success) {
            // Atribua valores de forma segura
            this.qtdeEmail = response.qtde_email || 0;
            this.totalEmail = response.total_email || 0;
            this.qtdeSms = response.qtde_sms || 0;
            this.totalSms = response.total_sms || 0;
            this.qtdeWhatsapp = response.qtde_whatsapp || 0;
            this.totalWhatsapp = response.total_whatsapp || 0;
            this.totalUtilizado = response.total_utilizado || 0;
            this.saldo = response.saldo || 0;

            // Atribua o objeto completo se for necessário
            this.dadosCards = response;
          } else {
            // Trate o caso de erro da API
            console.error('Erro na resposta da API:', response.msg || 'Mensagem não disponível');
          }
        } else {
          console.error('Resposta inválida da API:', response);
        }
      },
      (error) => {
        // Trate erros de comunicação com a API
        console.error('Erro ao obter os cards:', error);
      }
    );
  }


  public selecionarDevedor(devedor: DevedorModel): void {
    this.devedorSelecionado = devedor;
  }

  public filtraDevedor(): void {
    const pesquisa = this.textoPesquisa.toLowerCase();
    this.devedoresFiltrados = this.listarDevedores.filter((devedor) =>
      [
        devedor.id_cliente.toString(),
        devedor.id_contratante.toString(),
        devedor.cnpj_cpf,
        devedor.fantasia,
        devedor.nome,
        devedor.saldo_devedor.toString(),
      ].some((field) => field.toLowerCase().includes(pesquisa))
    );
  }

  public mascararCpfCnpj(value: string): string {
    if (value) {
      return Utils.formatarDocumento(value);
    }
    return value;
  }
}
