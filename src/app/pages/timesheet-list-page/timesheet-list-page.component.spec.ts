import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetListPageComponent } from './timesheet-list-page.component';

describe('TimesheetListPageComponent', () => {
  let component: TimesheetListPageComponent;
  let fixture: ComponentFixture<TimesheetListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimesheetListPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimesheetListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
