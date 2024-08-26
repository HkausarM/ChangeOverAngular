import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddheaderComponent } from './header.component';

describe('AddheaderComponent', () => {
  let component: AddheaderComponent;
  let fixture: ComponentFixture<AddheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddheaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
