export class TelefoneModel {
  fone: string;
  tipo: number;
  status_fone: string;
  obs_fone: string;
  prioritario?: any;
  possibilita_contato: number;
  whatsapp: string;
  cpc: string;
  ultima_acao: string;
  user_login: string;
}

export class TelefoneRetornoModel {
  success: string;
  msg: string;
  id_cliente: number;
  telefones: TelefoneModel[];
}

export class IdClienteModel {
  id_cliente: number;
}
