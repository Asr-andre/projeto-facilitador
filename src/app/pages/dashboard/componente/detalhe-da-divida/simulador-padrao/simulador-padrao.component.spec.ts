import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimuladorPadraoComponent } from './simulador-padrao.component';

describe('SimuladorPadraoComponent', () => {
  let component: SimuladorPadraoComponent;
  let fixture: ComponentFixture<SimuladorPadraoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimuladorPadraoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimuladorPadraoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
