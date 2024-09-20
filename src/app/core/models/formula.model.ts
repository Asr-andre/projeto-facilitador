export class Formula {
  id_formula?: number;
  id_empresa: number;
  descricao: string;
  fator_multa: number;
  fator_juros: number;
  fator_taxa: number;
  desconto_principal: number;
  desconto_multa: number;
  desconto_juros: number;
  desconto_taxa: number;
  data_cadastro?: string;
  data_alteracao?: string;
  user_login: string;
}

export class FormulaResponse {
  success: string;
  msg: string;
  id_empresa: string;
  formulas: Formula[];
}

export class RequisicaoFormula {
  id_empresa: number;
  id_formula: number;
  user_login: string;
}
