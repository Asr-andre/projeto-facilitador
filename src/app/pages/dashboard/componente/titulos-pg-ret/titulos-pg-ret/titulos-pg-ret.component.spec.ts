import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitulosPgRetComponent } from './titulos-pg-ret.component';

describe('TitulosPgRetComponent', () => {
  let component: TitulosPgRetComponent;
  let fixture: ComponentFixture<TitulosPgRetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosPgRetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TitulosPgRetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
