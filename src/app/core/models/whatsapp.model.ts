export class WhatsappMensagemModel {
  id_empresa: number;
  centrocusto: string;
  user_login: string;
  whats: WhatsDetalhe[];
}

export class WhatsDetalhe {
  numero: string;
  mensagem: string;
  idCustom: string;
  cpf: string;
  contrato: string;
  callbackRetorno: string;
}
