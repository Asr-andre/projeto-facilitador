import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsGeralComponent } from './logs-geral.component';

describe('LogsGeralComponent', () => {
  let component: LogsGeralComponent;
  let fixture: ComponentFixture<LogsGeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsGeralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogsGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
