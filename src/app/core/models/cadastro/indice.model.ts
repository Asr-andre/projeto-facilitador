export class IndiceRequest {
  indice: string;
  user_login: string
}

export class RetornoIndice {
  success: string;
  msg: string;
  indice: string;
  dados: Indice
  }

  export class Indice {
    data: string;
    valor: number;
  }
