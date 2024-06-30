import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contratante',
  templateUrl: './contratante.component.html',
  styleUrl: './contratante.component.scss'
})
export class ContratanteComponent implements OnInit{

  @Input() idEmpresa: string;

  ngOnInit() {

  }
}
