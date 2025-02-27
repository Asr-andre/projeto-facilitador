export class EnderecoRequestModel {
  id_cliente: number;
}

export class EnderecoModel {
  id_cliente: number;
  id_empresa: number;
  id_ender: number;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  tipo: string;
  origem: string;
  situacao: string;
}

export class EnderecoResponseModel {
  success: string;
  msg: string;
  id_cliente: string;
  enderecos: EnderecoModel[];
}
