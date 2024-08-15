import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarCreditosComponent } from './solicitar-creditos.component';

describe('SolicitarCreditosComponent', () => {
  let component: SolicitarCreditosComponent;
  let fixture: ComponentFixture<SolicitarCreditosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarCreditosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitarCreditosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
