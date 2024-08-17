import { Component } from '@angular/core';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.scss'
})
export class FinanceiroComponent {
  public contratanteSelecionado: number;
  public filtros: boolean = false;
  public loading: boolean =false;
  public ativaAba: number = 1;
  public selecionarTodos: boolean = false;
  public idUsuario: number | null = null;

  public textoPesquisa: string = "";
  public totalRegistros: number = 0;

  public totalClientes: number = 0;
  public valorTotal: number = 0;

  totalClientesSelecionados: number = 0;
  valorTotalSelecionado: number = 0;

  constructor(

  ) { }

}
