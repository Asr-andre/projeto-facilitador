import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiceComponent } from './indice.component';

describe('IndiceComponent', () => {
  let component: IndiceComponent;
  let fixture: ComponentFixture<IndiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
