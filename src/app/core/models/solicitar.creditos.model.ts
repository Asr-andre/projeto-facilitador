export class PixRequestModel {
  id_empresa: number;
  nome: string;
  cpf: string;
  valor: number;
  servico: string;
  user_login: string;
}

export class PixResponseModel {
  success: string;
  msg: string;
  id_empresa: string;
  pix: PixDetails;
}

export class PixDetails {
  status: string;
  calendario: Calendario;
  location: string;
  txid: string;
  revisao: number;
  devedor: Devedor;
  loc: Loc;
  valor: Valor;
  chave: string;
  solicitacaoPagador: string;
  pixCopiaECola: string;
  urlImagemQrCode: string;
}

export class Calendario {
  expiracao: number;
  criacao: string;
}

export class Devedor {
  cpf: string;
  nome: string;
}

export class Loc {
  id: number;
  location: string;
  tipoCob: string;
  criacao: string;
}

export class Valor {
  original: string;
}
