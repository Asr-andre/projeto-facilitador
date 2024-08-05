import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EnderecoModel, EnderecoResponseModel } from 'src/app/core/models/endereco.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EnderecoService } from 'src/app/core/services/endereco.service';

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.component.html',
  styleUrl: './endereco.component.scss'
})
export class EnderecoComponent implements OnInit, OnChanges {
  @Input() idCliente: number | undefined;
  public loadingMin: boolean = false;
  public enderecos: EnderecoModel[] = [];

  constructor(
    private _enderecoService: EnderecoService,
    private _alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.obterEnderecos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idCliente && !changes.idCliente.firstChange) {
      this.obterEnderecos();
    }
  }

  public obterEnderecos(): void {
    const request = { id_cliente: this.idCliente! };

    this.loadingMin = true;
    this._enderecoService.obterEnderecos(request).subscribe(
      (res: EnderecoResponseModel) => {
        this.enderecos = res.enderecos;
        this.loadingMin = false;
      },
      (error) => {
        this.loadingMin = false;
        this._alertService.error('Erro ao buscar endereços.');

      }
    );
  }
}
