import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinteticoComponent } from './sintetico.component';

describe('SinteticoComponent', () => {
  let component: SinteticoComponent;
  let fixture: ComponentFixture<SinteticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinteticoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SinteticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
