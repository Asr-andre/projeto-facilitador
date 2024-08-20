import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletoPixComponent } from './boleto-pix.component';

describe('BoletoPixComponent', () => {
  let component: BoletoPixComponent;
  let fixture: ComponentFixture<BoletoPixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoletoPixComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoletoPixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
