import { Component, DestroyRef, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TimeSheetService } from '../../service/time-sheet.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TemplateListComponent } from '../../components/template-list/template-list.component';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { templateMessage } from '../../constants';

@Component({
  selector: 'template-list-page',
  standalone: true,
  imports: [ CardModule, CalendarModule, FormsModule, ReactiveFormsModule, ButtonModule, TemplateListComponent, CommonModule ],
  templateUrl: './template-list-page.component.html',
  styleUrl: './template-list-page.component.scss'
})
export class TemplateListPageComponent {
  formGroup: FormGroup = new FormGroup({
    fromDate: new FormControl<Date | null>(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)),
    toDate: new FormControl<Date | null>(new Date())
  });
  private _timeSheetService = inject(TimeSheetService)
  destroyRef = inject(DestroyRef);
  templates = []
  noTemplatesFound = false;
  templateLoadError = false;
  messageService = inject(MessageService);

  ngOnInit(){
    this.submit()
  }

  submit(){
    this.templates = []
    this.noTemplatesFound = false;
    this.templateLoadError = false;
    if(!this.formGroup.controls["fromDate"].value){
      alert('From date is Required');
      return
    }

    if(!this.formGroup.controls["toDate"].value){
      alert('To date is Required');
      return
    }

    if(this.formGroup.controls["fromDate"].value && this.formGroup.controls["toDate"].value && this.formGroup.controls["fromDate"].value > this.formGroup.controls["toDate"].value){
      alert('From date should not be greater than To date');
      return;
    }
    this._timeSheetService.getTimeSheetTemplates({
      fromMonth: this.formGroup.value.fromDate.getMonth(),
      fromYear: this.formGroup.value.fromDate.getFullYear(),
      toMonth: this.formGroup.value.toDate.getMonth(),
      toYear: this.formGroup.value.toDate.getFullYear(),
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
      ).subscribe({
      next: (templates) => {
        if(templates.length){
          this.templates = templates;
        }
        else{
          this.noTemplatesFound = true;
        }
      },
      error: (e) => {
        this.templateLoadError = true;
        this.messageService.add({ severity: 'error', summary: templateMessage.templatesFetchError, detail: e.error.message });
      }
    })
  }
}
