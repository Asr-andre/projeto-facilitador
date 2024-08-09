export class CarteiraClienteRequisicao {
  id_empresa: number;
  id_contratante: number;
  cidade: string;
  uf: string;
  email: string;
  celular: string;
  fone: string;
  sem_fila: string;
  com_acordo: string;
  dias_atraso_inicial: number;
  dias_atraso_final: number;
  periodo_vencimento_inicial?: string;
  periodo_vencimento_final?: string;
  periodo_importacao_inicial?: string;
  periodo_importacao_final?: string;
  dias_sem_acionamento_inicial?: string;
  dias_sem_acionamento_final?: string;
  user_login: string;
}

export class CarteiraClienteModel {
  fantasia: string;
  id_cliente: number;
  cnpj_cpf: string;
  nome: string;
  vencimento_mais_antigo: string;
  dias_em_atraso: number;
  valor_total_divida: number;
  produto: string;
  data_ultimo_acionamento: string;
  acao: string;
  dias_sem_acionamento: number;
}

export class CarteiraClientesResponse {
  success: string;
  msg: string;
  id_empresa: string;
  id_contratantes: string;
  clientes: CarteiraClienteModel[];
}
