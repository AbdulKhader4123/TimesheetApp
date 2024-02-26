import { Component, DestroyRef, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TimeSheetService } from '../../service/time-sheet.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TimesheetListComponent } from '../../components/timesheet-list/timesheet-list.component';
import { MessageService } from 'primeng/api';
import { timesheetMessage } from '../../constants';

@Component({
  selector: 'timesheet-list-page',
  standalone: true,
  imports: [ CardModule, CalendarModule, FormsModule, ReactiveFormsModule, ButtonModule, CommonModule, TimesheetListComponent ],
  templateUrl: './timesheet-list-page.component.html',
  styleUrl: './timesheet-list-page.component.scss'
})
export class TimesheetListPageComponent {

  formGroup: FormGroup = new FormGroup({
    fromDate: new FormControl<Date | null>(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)),
    toDate: new FormControl<Date | null>(new Date())
  });
  private _timeSheetService = inject(TimeSheetService)
  destroyRef = inject(DestroyRef);
  timesheets = []
  noTimesheetsFound = false;
  timesheetLoadError = false;
  messageService = inject(MessageService);
  
  ngOnInit(){
    this.submit()
    this._timeSheetService.timeSheetRefreshObervable$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res=>{
      this.submit();
    })
  }

  submit(){
    this.timesheets = []
    this.timesheetLoadError = false;
    this.noTimesheetsFound = false;
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
    this._timeSheetService.getTimeSheets({
      fromMonth: this.formGroup.value.fromDate.getMonth(),
      fromYear: this.formGroup.value.fromDate.getFullYear(),
      toMonth: this.formGroup.value.toDate.getMonth(),
      toYear: this.formGroup.value.toDate.getFullYear(),
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
      ).subscribe({
      next: (timesheets) => {
        if(timesheets.length){
          this.timesheets = timesheets;
        }
        else{
          this.noTimesheetsFound = true;
        }
      },
      error: (e) => {
        this.timesheetLoadError = true;
        this.messageService.add({ severity: 'error', summary: timesheetMessage.timesheetsFetchError, detail: e.error.message });
      }
    })
  }
}
