import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilNotificacoesComponent } from './perfil-notificacoes.component';

describe('PerfilNotificacoesComponent', () => {
  let component: PerfilNotificacoesComponent;
  let fixture: ComponentFixture<PerfilNotificacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilNotificacoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilNotificacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
