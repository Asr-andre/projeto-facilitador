export class RequisicaoChatModel {
  numero: string;
}

export class HistoricoChat {
  success: string;
  msg: string;
  nome: string;
  telefone: string;
  historico: HistoricoItem[];
}

export class HistoricoItem {
  envio: string;
  mensagem: string;
  data: string;
}

//-------------Este e a parte da interação do chat ----------------------

export class MensagemRequestModel {
  centro_custo: string;
  telefone: string;
  mensagem: string;
}

export class MensagemResponseModel {
  success: string;
  msg: string;
  telefone: string;
}
