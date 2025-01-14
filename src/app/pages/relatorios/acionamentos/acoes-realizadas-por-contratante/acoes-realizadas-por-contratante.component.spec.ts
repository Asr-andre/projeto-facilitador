import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcoesRealizadasPorContratanteComponent } from './acoes-realizadas-por-contratante.component';

describe('AcoesRealizadasPorContratanteComponent', () => {
  let component: AcoesRealizadasPorContratanteComponent;
  let fixture: ComponentFixture<AcoesRealizadasPorContratanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcoesRealizadasPorContratanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcoesRealizadasPorContratanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
