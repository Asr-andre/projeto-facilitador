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
  uf: string;
  cep: string;
  telefone: string;
  celular: string;
  ativo: string;
  codigo_credor: string;
  id_formula: number | null;
  data_cadastro: string;
  data_alteracao: string | null;
  user_login: string;
}

export class ContratantesRetornoModel {
  success: string;
  msg: string;
  id_empresa: string;
  contratantes: ContratanteModel[];
}
