export class RequisicaoPesquisaModel {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number
  ultimo_andamento: string;
  data_inicio: string;
  data_fim: string;
  user_login: string;
}

export class RetornoPesquisaModel {
  success: string;
  msg: string;
  id_empresa: string;
  processos: Processos [];
}

export class Processos {
  fantasia: string;
  nome: string;
  cnpj_cpf: string;
  tipo_acao: string;
  numero_processo: string;
  data_entrada_processo: string;
  data_audiencia: string;
  tipo_acao_1: string;
  comarca: string;
  ultimo_andamento: string;
  obs; string;
}
