export class ClienteModel {
  id_empresa: number;
  id_contratante: number;
  id_cliente?: number;
  identificador?: string;
  nome: string;
  tipo_pessoa: string;
  cnpj_cpf: string;
  rg: string;
  orgao_expedidor: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  pai: string;
  mae: string;
  sexo: string;
  conjuge: string;
  trabalho: string;
  cargo: string;
  valor_renda: number;
  melhor_canal_localizacao: string;
  fone_celular?: string;
  fone_comercial?: string;
  fone_residencial?: string;
  email?: string;
  user_login: string;
  data_nascimento: string;
}

// esse campos estão sendo usado para o componente de cadastro de cliente
export class Cliente {
  id_cliente: number;
  id_empresa: number;
  id_contratante: number;
  cnpj_cpf: string;
  nome: string;
  identificador: string;
  tipo_pessoa: string;
  rg: string;
  orgao_expedidor: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  pai: string;
  mae: string;
  data_nascimento: string | null;
  sexo: string;
  conjuge: string;
  trabalho: string;
  cargo: string;
  valor_renda: number;
  melhor_canal_localizacao: string;
  data_cadastro: string;
  data_alteracao: string | null;
  titulos: Titulo[];
  user_login: string;
}

export class Titulo {
  id_titulo: number;
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
  tipo_titulo: number;
  numero_contrato: string;
  numero_documento: string;
  descricao: string;
  parcela: number;
  plano: number;
  vencimento: string;
  valor: number;
  valor_original: number;
  valor_atualizado: number;
  valor_multa: number;
  valor_juros: number;
  valor_taxa: number;
  saldo_devedor: number;
  desc_principal: number;
  desc_multa: number;
  desc_juros: number;
  desc_taxa: number;
  receita_principal: number | null;
  receita_multa: number | null;
  receita_juros: number | null;
  receitas_taxa: number | null;
  comissao: number | null;
  repasse: number | null;
  atraso: number;
  id_remessa: number | null;
  id_acao: number;
  id_fila: number;
  id_usuario: number;
  id_acordo: number | null;
  pagamento: string | null;
  tipo_baixa: string | null;
  valor_pago: number;
  pago: string;
  percem_pago: number | null;
  data_prox_acio: string;
  user_baixa: string | null;
  codigo_produto: string;
  tipo_produto: string;
  produto: string;
  loja: string;
  carteira: string;
  codigo_credor: string;
  situacao: string;
  data_importacao: string;
  data_compra: string | null;
  valor_compra: number | null;
  data_cadastro: string;
  data_alteracao: string | null;
  user_login: string;
}

export class Retorno {
  success: string;
  msg: string;
  cliente: Cliente[];
}

// modelo para o cadsatro de cliente na tela de detalhamento de cliente
export class CadastrarTituloRequest {
  id_empresa: number;
  id_contratante: number;
  id_cliente: number;
  tipo_titulo: number;
  numero_contrato: string;
  numero_documento: string;
  parcela: number;
  plano: number;
  vencimento: string;
  valor: number;
  produto: string;
  user_login: string;
}

export class CadastrarTituloResponse {
  success: string;
  msg: string;
  id_empresa: string;
  id_cliente: string;
}
