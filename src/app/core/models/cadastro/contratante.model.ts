export class ContratanteModel {
  id_contratante: number;
  id_empresa: number;
  cnpj: string;
  razao_social: string;
  fantasia: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  chavepix: string;
  uf: string;
  cep: string;
  telefone: string;
  celular: string;
  ativo: string;
  codigo_credor: string;
  id_formula: number;
  id_perfilemail?: number;
  id_perfilsms?: number;
  id_perfilboleto?: number;
  id_perfilwhatsapp?: number;
  id_perfiltextoemail: number;
  data_cadastro: string;
  data_alteracao?: string;
  user_login: string;
}

export class ContratantesRetornoModel {
  success: string;
  msg: string;
  id_empresa: string;
  contratantes: ContratanteModel[];
}

export class RequisicaoContratanteModel {
  id_empresa: number;
  id_contratante: number;
  user_login: string;
}

export class RespostaContratanteModel {
  success: string;
  msg: string;
  data: ContratanteModel[];
}

export class RetornoGenerico {
  success: boolean;
  msg: string;
  id_contratante: number;
}
