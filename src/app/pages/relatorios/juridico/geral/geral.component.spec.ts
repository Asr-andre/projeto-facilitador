import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeralComponent } from './geral.component';

describe('GeralComponent', () => {
  let component: GeralComponent;
  let fixture: ComponentFixture<GeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
