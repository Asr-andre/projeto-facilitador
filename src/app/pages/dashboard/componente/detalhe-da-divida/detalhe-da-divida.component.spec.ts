import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheDaDividaComponent } from './detalhe-da-divida.component';

describe('DetalheDaDividaComponent', () => {
  let component: DetalheDaDividaComponent;
  let fixture: ComponentFixture<DetalheDaDividaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheDaDividaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalheDaDividaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
