import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcionamentosSinteticoComponent } from './acionamentos-sintetico.component';

describe('AcionamentosSinteticoComponent', () => {
  let component: AcionamentosSinteticoComponent;
  let fixture: ComponentFixture<AcionamentosSinteticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcionamentosSinteticoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcionamentosSinteticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
