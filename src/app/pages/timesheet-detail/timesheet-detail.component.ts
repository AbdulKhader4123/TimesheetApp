import { Component, DestroyRef, Input, inject } from '@angular/core';
import { TimeSheetService } from '../../service/time-sheet.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeSheetTableComponent } from '../../components/time-sheet-table/time-sheet-table.component';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import {  APP_ROUTES, STATUS, timesheetMessage } from '../../constants';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'timesheet-detail',
  standalone: true,
  imports: [TimeSheetTableComponent, CommonModule, CardModule, ButtonModule, ConfirmDialogModule, TagModule],
  templateUrl: './timesheet-detail.component.html',
  styleUrl: './timesheet-detail.component.scss',
  providers: [ConfirmationService]
})
export class TimesheetDetailComponent {
  private _timeSheetService = inject(TimeSheetService)
  destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute)
  private confirmationService = inject(ConfirmationService);
  @Input('id') timesheetId ='';
  timesheetData!: any;
  messageService = inject(MessageService);
  private authService = inject(MsalService);
  timesheetLoadError = false;
  router = inject(Router);
  userId=""

  get timesheetOwner(){
    return this.timesheetData.created_by === this.userId;
  }

  ngOnInit(){
   this.getTimesheetDetails()
    this.userId = this.authService.instance.getActiveAccount()?.idTokenClaims?.oid || "";
  }

  back(){
    if(this.timesheetOwner){
      this.router.navigateByUrl(APP_ROUTES.timeSheets)
    }
    else{
      this.router.navigateByUrl(APP_ROUTES.approvals)
    }
  }
 
  getTimesheetDetails(){
    this.timesheetLoadError = false;
    this._timeSheetService.getTimeSheet(this.timesheetId).pipe(
      takeUntilDestroyed(this.destroyRef)
      ).subscribe({
      next: (res) => {
        if(res){
          this.timesheetData = res;
        }
      },
      error: (e) => {
      this.timesheetLoadError = true;
        this.messageService.add({ severity: 'error', summary: timesheetMessage.timesheetFetchError, detail: e.error.message });
      }
    })
  }

  save(){
    this._timeSheetService.updateTimeSheet(
      { timesheetId: this.timesheetId,
        days: this.timesheetData?.days
      }).pipe(
      takeUntilDestroyed(this.destroyRef)
      ).subscribe({
      next: (res) => {
        if(res){
          this.messageService.add({ severity: 'success', summary: 'Success', detail: timesheetMessage.timesheetUpdateSuccess });
        }
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: timesheetMessage.timesheetUpdateError, detail: e.error.message });
      }
    })
  }

  withdrawDialog(event: any, timesheet: any){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to withdraw your timesheet?',
      header: `Withdraw timesheet (${timesheet.name})`,
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",
      acceptLabel: "Yes, back to draft",
      accept: () => {
        this.withdrawTimesheet(timesheet._id)
      },
      reject: () => {

      }
    });
  }

  withdrawTimesheet(timesheetId: string){
    this._timeSheetService.updateTimeSheet(
      { 
        timesheetId: timesheetId,
        status: STATUS.DRAFT
      }
      ).pipe(
      takeUntilDestroyed(this.destroyRef)
      ).subscribe({
      next: (res) => {
        if(res){
          this.messageService.add({ severity: 'success', summary: 'Success', detail: timesheetMessage.timesheetWithdrawSuccess });
          this.getTimesheetDetails()
        }
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: timesheetMessage.timesheetWithdrawError, detail: e.error.message });
      }
    })
  }

  getSeverity(status: string) {
    switch (status?.toLowerCase()) {
        case STATUS.REJECTED:
            return 'danger';
        case STATUS.APPROVED:
            return 'success';
        case STATUS.REVIEWED:
            return 'warning';
        case STATUS.SUBMITTED:
            return 'info';
        default:
          return ;
    }
  }
}
