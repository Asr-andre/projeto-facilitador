import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
export class RequisicaoTitulosLiquidados {
  id_empresa: number;
  id_contratante: number;
  data_inicio: string;
  data_fim: string;
  user_login: string;
  tipo: string;
}

export class TituloLiquidado {
  nome: string;
  cnpj_cpf: string;
  id_empresa: number;
  fantasia: string;
  numero_contrato: string;
  numero_documento: string;
  produto: string;
  pagamento: string;
  valor_pago: number;
  valor_original: number | null;
  valor_juros: number;
  valor_multa: number;
  valor_taxa: number;
  desc_principal: number;
  desc_multa: number;
  desc_juros: number;
  receita_principal: number;
  receita_multa: number;
  receita_juros: number;
  receita_taxa: number;
  comissao: number;
  repasse: number;
  id_recibo: number;
  vencimento: string;
  parcela: number;
  plano: number;
}

export class RetornoTitulosLiquidados {
  success: string;
  msg: string;
  id_empresa: string;
  titulos: TituloLiquidado[];
}
