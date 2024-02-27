import { Component, DestroyRef, Input, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TimeSheetService } from '../../service/time-sheet.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { STATUS, timesheetMessage } from '../../constants';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
@Component({
  selector: 'timesheet-list',
  standalone: true,
  imports: [ MessagesModule, TableModule, FormsModule, CommonModule, RouterModule, TagModule, ButtonModule, ConfirmDialogModule, DialogModule,
     ReactiveFormsModule, InputTextModule ],
  templateUrl: './timesheet-list.component.html',
  styleUrl: './timesheet-list.component.scss',
  providers: [ConfirmationService]
})
export class TimesheetListComponent {
  @Input({ required: true }) timesheets: any;

  private _timeSheetService = inject(TimeSheetService);
  private confirmationService = inject(ConfirmationService);
  destroyRef = inject(DestroyRef);
  messageService = inject(MessageService);
  submitModalVisible = false;
  submitModalHeader = "";
  selectedTimesheet: any;
  approverForm= new FormGroup({
    approver: new FormControl("", [Validators.required]),
    reviewer: new FormControl("", [Validators.required])
  })

  get approver() {
    return this.approverForm.get('approver');
  }

  get reviewer() {
    return this.approverForm.get('reviewer');
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

  submitDialog(timesheet: any){
    this.submitModalHeader = `Submit TimeSheet (${timesheet.name})`
    this.submitModalVisible = true;
    this.selectedTimesheet = timesheet;
    this.approver?.setValue(timesheet?.approver || "");
    this.reviewer?.setValue(timesheet?.reviewer || "");
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
          this._timeSheetService.refreshTimeSheets();
        }
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: timesheetMessage.timesheetWithdrawError, detail: e.error.message });
      }
    })
  }

  submitTimesheet(timesheet: any){
    if(!this.approverForm.valid){
      return
    }
    this._timeSheetService.updateTimeSheet(
      { 
        timesheetId: timesheet._id,
        approver: this.approver?.value?.trim(),
        reviewer: this.reviewer?.value?.trim(),
        status: STATUS.SUBMITTED
      }
      ).pipe(
      takeUntilDestroyed(this.destroyRef)
      ).subscribe({
      next: (res) => {
        if(res){
          this.messageService.add({ severity: 'success', summary: 'Success', detail: timesheetMessage.timesheetSubmitSuccess });
          this._timeSheetService.refreshTimeSheets();
        }
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: timesheetMessage.timesheetSubmitError, detail: e.error.message });
      }
    })
  }
}