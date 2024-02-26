import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTimeSheetPageComponent } from './create-time-sheet-page.component';

describe('CreateTimeSheetPageComponent', () => {
  let component: CreateTimeSheetPageComponent;
  let fixture: ComponentFixture<CreateTimeSheetPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTimeSheetPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateTimeSheetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
