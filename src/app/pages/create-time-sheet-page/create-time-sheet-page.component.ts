import { Component, ViewChild, inject, DestroyRef } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { generateTemplate } from '../../utilities';
import { APP_ROUTES, calendarData, templateMessage } from '../../constants';
import { CommonModule } from '@angular/common';
import { TimeSheetService } from '../../service/time-sheet.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TemplateTableComponent } from '../../components/template-table/template-table.component';

@Component({
  selector: 'create-time-sheet-page',
  standalone: true,
  imports: [ CardModule, CalendarModule, FormsModule, ReactiveFormsModule, ButtonModule, TemplateTableComponent, CommonModule ],
  templateUrl: './create-time-sheet-page.component.html',
  styleUrl: './create-time-sheet-page.component.scss'
})
export class CreateTimeSheetPageComponent {
  @ViewChild('calendarRef') calendarRef!: Calendar;
  formGroup: FormGroup = new FormGroup({
    holidays: new FormControl([])
  });
  currentCalendar = {
    month: (new Date()).getMonth(),
    year: (new Date()).getFullYear()
  }
  timeSheetName = `TimeSheet_${calendarData.months[this.currentCalendar.month]}_${this.currentCalendar.year}`
  templateData!: any;
  private _timeSheetService = inject(TimeSheetService)
  destroyRef = inject(DestroyRef);
  messageService = inject(MessageService);
  router = inject(Router);


  preview(){
    this.generateTemplate();
    this.templateData = {
      ...this.templateData,
      templateCreateMode: true
    }
  }

  generateTemplate(){
    this.templateData = {
      ...generateTemplate(this.currentCalendar.month, this.currentCalendar.year, this.formGroup.controls['holidays'].value, this.timeSheetName)
    }
  }

  createTemplate(){
    this.generateTemplate();
    this._timeSheetService.createTimeSheetTemplate(this.templateData).pipe(
      takeUntilDestroyed(this.destroyRef)
      ).subscribe({
      next: (v) => {
        if(v){
          this.messageService.add({ severity: 'success', summary: 'Success', detail: templateMessage.templateCreateSuccess });
          this.router.navigate([APP_ROUTES.templates])
        }
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: templateMessage.templateCreateError, detail: e.error.message });
        console.error(e)
      }
    })
  }

  monthChange(e: any){
    this.currentCalendar = {
      month: e.month -1,
      year: e.year
    };
    this.timeSheetName = `TimeSheet_${calendarData.months[this.currentCalendar.month]}_${this.currentCalendar.year}`
    this.calendarRef.clear()
  }

}
