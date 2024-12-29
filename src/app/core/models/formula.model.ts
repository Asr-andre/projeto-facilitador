export class Formula {
  id_formula?: number;
  usa_indice?: string;
  id_empresa: number;
  descricao: string;
  fator_multa: number;
  fator_juros: number;
  fator_taxa: number;
  desconto_indice: number;
  desconto_principal: number;
  desconto_multa: number;
  desconto_juros: number;
  desconto_taxa: number;
  receita_principal: number;
  receita_multa: number;
  receita_juros: number;
  receita_indice: number;
  receita_taxa: number;
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

export class FormulaRequest {
  id_empresa: number;
  descricao: string;
  usa_indice?: string;
  fator_multa: number;
  fator_juros: number;
  fator_taxa: number;
  desconto_principal: number;
  desconto_multa: number;
  desconto_juros: number;
  desconto_taxa: number;
  desconto_indice: number;
  receita_principal: number;
  receita_multa: number;
  receita_juros: number;
  receita_indice: number;
  receita_taxa: number;
  user_login: string;
}

export class RetornoFormula {
  success: string;
  msg: string;
  id_empresa: string;
  id_formula: string;
}
