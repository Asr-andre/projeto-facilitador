export class WhatsappMensagemModel {
  id_empresa: number;
  id_contratante:number;
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

//Envia class paara tratar o envio e o retorno do whatsapp em lote
export class WhatsAppLoteRequestModel {
  id_empresa: number;
  id_perfilwhatsapp: number;
  user_login: string;
  clientes: string;
}

export class WhatsAppLoteResponseModel{
  success: string;
  msg: string;
  empresa: number;
  qtde_fones: string;
  valor_envio: number;
  saldo_empresa: number;
}

export class RetornoWathsappModel{
  id_empresa: number;
  msg: string;
  retorno: string;
  success: string;
}
