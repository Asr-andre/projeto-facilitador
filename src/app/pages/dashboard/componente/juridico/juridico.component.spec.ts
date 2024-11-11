import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuridicoComponent } from './juridico.component';

describe('JuridicoComponent', () => {
  let component: JuridicoComponent;
  let fixture: ComponentFixture<JuridicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuridicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JuridicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
