import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimeSheetService } from '../../service/time-sheet.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { STATUS, timesheetMessage } from '../../constants';
import { MsalService } from '@azure/msal-angular';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'approvals',
  standalone: true,
  imports: [ TableModule, CommonModule, RouterModule, TagModule, ButtonModule, ConfirmDialogModule, DialogModule, CardModule, FormsModule ],
  templateUrl: './approvals.component.html',
  styleUrl: './approvals.component.scss',
  providers: [ConfirmationService]
})
export class ApprovalsComponent {
  private _timeSheetService = inject(TimeSheetService);
  private confirmationService = inject(ConfirmationService);
  private authService = inject(MsalService);

  destroyRef = inject(DestroyRef);
  messageService = inject(MessageService);
  rejectModalVisible = false;
  rejectModalHeader = "";
  rejectReason = "";
  selectedTimesheet: any;
  timesheets = []
  noTimesheetsFound = false;
  timesheetLoadError = false;
  activeAccountName = "";
  ngOnInit(){
    this.activeAccountName = this.authService.instance.getActiveAccount()?.username || "";
    this.getTimesheets();
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
  
  rejectDialog(timesheet: any){
    this.rejectModalHeader = `Reject timesheet (${timesheet.name}) for ${timesheet.email}`
    this.rejectModalVisible = true;
    this.selectedTimesheet = timesheet;
    this.rejectReason = "";
  }

  approveDialog(event: any, timesheet: any){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `${timesheet.status === STATUS.SUBMITTED ? "Timesheet yet to be reviewed!." : ""} Are you sure you want to approve this timesheet? `,
      header: `Approve timesheet (${timesheet.name}) for ${timesheet.email}`,
      acceptButtonStyleClass:"p-button-text p-button-text",
      rejectButtonStyleClass:"p-button-danger p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",
      rejectLabel: "Cancel",
      acceptLabel: "Yes, approve",
      accept: () => {
        this.approveTimesheet(timesheet._id, STATUS.APPROVED)
      },
    });
  }

  reviewDialog(event: any, timesheet: any){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to review this timesheet?',
      header: `Review timesheet (${timesheet.name}) for ${timesheet.email}`,
      acceptButtonStyleClass:"p-button-text p-button-text",
      rejectButtonStyleClass:"p-button-danger p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",
      rejectLabel: "Cancel",
      accept: () => {
        this.approveTimesheet(timesheet._id, STATUS.REVIEWED)
      },
    });
  }

  rejectTimesheet(timesheetId: string){
    this._timeSheetService.updateTimeSheetStatus(
      { 
        timesheetId,
        status: STATUS.REJECTED,
        comments: this.rejectReason?.trim()
      }
      ).pipe(
      takeUntilDestroyed(this.destroyRef)
      ).subscribe({
      next: (res) => {
        if(res){
          this.rejectModalVisible = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: timesheetMessage.timesheetUpdateSuccess });
          this.getTimesheets();
        }
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: timesheetMessage.timesheetUpdateError, detail: e.error.message });
      }
    })
  }

  approveTimesheet(timesheetId: string, status: string, comments?:string){
   
    this._timeSheetService.updateTimeSheetStatus(
      { 
        timesheetId,
        status,
        comments: comments?.trim()
      }
      ).pipe(
      takeUntilDestroyed(this.destroyRef)
      ).subscribe({
      next: (res) => {
        if(res){
          this.messageService.add({ severity: 'success', summary: 'Success', detail: timesheetMessage.timesheetUpdateSuccess });
          this.getTimesheets();
        }
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: timesheetMessage.timesheetUpdateError, detail: e.error.message });
      }
    })
  }

  getTimesheets(){
    this.timesheets = []
    this.timesheetLoadError = false;
    this.noTimesheetsFound = false;

    this._timeSheetService.getTimeSheetsForApprovals().pipe(
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
