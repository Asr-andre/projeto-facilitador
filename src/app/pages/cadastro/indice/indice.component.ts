import { Component, OnInit } from '@angular/core';
import { Indice } from 'src/app/core/models/cadastro/indice.model';
import { IndiceService } from 'src/app/core/services/indice.service';

@Component({
  selector: 'app-indice',
  templateUrl: './indice.component.html',
  styleUrl: './indice.component.scss'
})
export class IndiceComponent implements OnInit {
  public listarIndice: Indice [] = [];

  constructor(
    private _indiceService: IndiceService
  ) {}

  ngOnInit(): void {

  }

}
