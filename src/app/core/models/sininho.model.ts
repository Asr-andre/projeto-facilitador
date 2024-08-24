export class RequisicaoModel {
  id_empresa: number;
}


export class AlertaModel {
  id: string;
  cpf: string;
  mensagem: string;
  telefone: string;
  data_men: string;
}

export class RespostaModel {
  success: boolean;
  msg: string;
  id_empresa: number;
  alertas: AlertaModel[];
}
