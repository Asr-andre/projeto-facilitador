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
