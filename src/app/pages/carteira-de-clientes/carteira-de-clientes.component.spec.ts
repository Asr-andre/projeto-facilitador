import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteiraDeClientesComponent } from './carteira-de-clientes.component';

describe('CarteiraDeClientesComponent', () => {
  let component: CarteiraDeClientesComponent;
  let fixture: ComponentFixture<CarteiraDeClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteiraDeClientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarteiraDeClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
