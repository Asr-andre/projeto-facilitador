export class RequisicaoChatModel {
  numero: string;
  canal: string;
}

export class HistoricoChat {
  success: string;
  msg: string;
  telefone: string;
  canal: string;
  mensagens: HistoricoItem[];
}

export class HistoricoItem {
  tipo: string;
  mensagem: string;
  data_local: string;
}

//-------------Este e a parte da interação do chat ----------------------

export class MensagemRequestModel {
  numero: string;
  canal: string;
  mensagem: string;
  idcustom: number;
  centro_custo: string;
}

export class MensagemResponseModel {
  success: string;
  msg: string;
  telefone: string;
  data: string;
}
