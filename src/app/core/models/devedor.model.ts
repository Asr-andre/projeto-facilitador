export class RequisicaoDevedorModel {
  id_empresa: number;
  id_fila?: number;
  cnpj_cpf?: string;
  nome?: string;
  mostrar_cliente_sem_divida?: string;
}


export class RespostaDevedorModel {
  success: string;
  msg: string;
  id_empresa: string;
  clientes: DevedorModel[];
}

export class DevedorModel {
  id_cliente: number;
  cnpj_cpf: string;
  nome: string;
  id_contratante: number;
  fantasia: string;
  soma_titulos_nao_pagos: number | null;
  data_acionamento: string;
  descricao_acao: string;
}
