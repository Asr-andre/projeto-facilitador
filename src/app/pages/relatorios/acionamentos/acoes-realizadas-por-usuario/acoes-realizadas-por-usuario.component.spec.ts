import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcoesRealizadasPorUsuarioComponent } from './acoes-realizadas-por-usuario.component';

describe('AcoesRealizadasPorUsuarioComponent', () => {
  let component: AcoesRealizadasPorUsuarioComponent;
  let fixture: ComponentFixture<AcoesRealizadasPorUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcoesRealizadasPorUsuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcoesRealizadasPorUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
