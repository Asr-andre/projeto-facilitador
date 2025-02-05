export class AcionamentoModel {
  id_acionamento: number;
  descricao: string;
  data_acio: string;
  data_prox_acio?: string;
  mensagem: string;
  usuario: string;
  fone: string;
  titulo: string;
}

export class RetornoAcionamentoModel {
  success: string;
  msg: string;
  id_cliente: string;
  id_contratante: string;
  acionamentos: AcionamentoModel[];
}

export class RequisicaoAcionamentoModel {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
}

export class InserirAcionamentoModel {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
  id_acao: number;
  id_fila: number;
  data_prox_acio?: string;
  id_usuario: number;
  mensagem: string;
  user_login: string;
}

export class AcionamentoResponseModel {
  id_acionamento: string;
  id_cliente: string;
  msg: string;
  success: string;
}
