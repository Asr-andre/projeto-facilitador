export class RequisicaoEmailPerfil {
  id_empresa: number;
  user_login: string;
}

export class RetornoEmailPerfil {
  success: string;
  msg: string;
  id_empresa: string;
  mensagens: MensagemEmailPerfil[];
}

export class MensagemEmailPerfil {
  id_emailtexto: number;
  id_empresa: number;
  descricao: string;
  mensagem: string;
  data_cadastro: string | null;
  data_alteracao: string | null;
  user_login: string;
  user_ip: string;
}

export class RequisicaoPerfilEmail {
  id_emailtexto?: number;
  id_empresa: number;
  descricao: string;
  mensagem: string;
  user_login: string;
}

export class RetornoPerfilEmail {
  success: string;
  msg: string;
  id_empresa: string;
  id_emailtexto?: string;
}
