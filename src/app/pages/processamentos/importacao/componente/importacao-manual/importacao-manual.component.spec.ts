import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportacaoManualComponent } from './importacao-manual.component';

describe('ImportacaoManualComponent', () => {
  let component: ImportacaoManualComponent;
  let fixture: ComponentFixture<ImportacaoManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportacaoManualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportacaoManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
