import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEmailComponent } from './modal-email.component';

describe('ModalEmailComponent', () => {
  let component: ModalEmailComponent;
  let fixture: ComponentFixture<ModalEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
