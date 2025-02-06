export class RequisicaoContaBancaria {
  id_empresa: number;
  user_login: string;
}

export class RespostaContaBancaria {
  success: string;
  msg: string;
  id_empresa: number;
  dados: DadosContaBancaria[];
}

export class DadosContaBancaria {
  id_boletoperfil?: number;
  id_empresa: number;
  descricao?: string;
  banco?: string;
  agencia?: string;
  agencia_dg?: string;
  conta?: string;
  conta_dg?: string;
  carteira?: string;
  variacao?: string;
  codigo_cedente?: string;
  local_pgto?: string;
  instrucoes?: string;
  client_id?: string;
  client_auth?: string;
  client_secret?: string;
  client_key?: string;
  caminho_certificado_crt?: string;
  caminho_certificado_key?: string;
  local_pgto_pix?: string;
  instrucao_pix?: string;
  chave_pix?: string;
  client_id_pix?: string;
  client_secret_pix?: string;
  caminho_certificado_crt_pix?: string;
  caminho_certificado_key_pix?: string;
  host_api?: string;
  data_cadastro?: string;
  data_alteracao?: string;
  user_login: string;
}
