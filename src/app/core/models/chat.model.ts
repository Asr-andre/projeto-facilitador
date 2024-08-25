export class RequisicaoChatModel {
  id: string;
}

export interface Mensagem {
  mensagem: string;
  data_local: string;
}

export interface ChatResponseModel {
  success: string;
  msg: string;
  id: string;
  mensagens: Mensagem[];
}
