export class IndiceRequest {
  indice: string;
  user_login: string
}

export class RetornoIndice {
  success: string;
  msg: string;
  indice: string;
  dados: Indice[]
  }

  export class Indice {
    indice: string;
    data: string;
    valor: number;
  }

//modeloe para o cadastro e etualziação dos indices

export class IndiceModel {
  indice: string;
  data: string;
  valor?: number;
  user_login: string
}

export class Retorno {
  success: string;
  msg: string;
  indice: string;
  dados: Indice;
  }
