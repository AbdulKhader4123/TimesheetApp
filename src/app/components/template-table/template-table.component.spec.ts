import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateTableComponent } from './template-table.component';

describe('TemplateTableComponent', () => {
  let component: TemplateTableComponent;
  let fixture: ComponentFixture<TemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
