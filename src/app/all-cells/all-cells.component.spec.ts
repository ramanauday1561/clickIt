import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCellsComponent } from './all-cells.component';

describe('AllCellsComponent', () => {
  let component: AllCellsComponent;
  let fixture: ComponentFixture<AllCellsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllCellsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
