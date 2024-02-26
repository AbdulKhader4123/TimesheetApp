import { Component, DestroyRef, Input, inject } from '@angular/core';
import { TimeSheetService } from '../../service/time-sheet.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TemplateTableComponent } from '../../components/template-table/template-table.component';
import { MessageService } from 'primeng/api';
import {  APP_ROUTES, templateMessage, timesheetMessage } from '../../constants';

@Component({
  selector: 'template-detail',
  standalone: true,
  imports: [TemplateTableComponent, CommonModule, CardModule, ButtonModule],
  templateUrl: './template-detail.component.html',
  styleUrl: './template-detail.component.scss'
})
export class TemplateDetailComponent {
  private _timeSheetService = inject(TimeSheetService)
  destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute)
  @Input('id') templateId ='';
  templateData!: any;
  messageService = inject(MessageService);
  templateLoadError = false;
  router = inject(Router);
  
  ngOnInit(){
   this.getTemplateDetails()
  }

  back(){
    this.router.navigateByUrl(APP_ROUTES.templates)
  }

  getTemplateDetails(){
    this.templateLoadError = false;
    this._timeSheetService.getTimeSheetTemplate(this.templateId).pipe(
      takeUntilDestroyed(this.destroyRef)
      ).subscribe({
      next: (res) => {
        if(res){
          this.templateData = res;
        }
      },
      error: (e) => {
        this.templateLoadError = true;
        this.messageService.add({ severity: 'error', summary: templateMessage.templateFetchError, detail: e.error.message });
        
      }
    })
  }

  createTimesheet(){
    this._timeSheetService.createTimeSheet(this.templateId).pipe(
      takeUntilDestroyed(this.destroyRef)
      ).subscribe({
      next: (res) => {
        if(res){
          this.messageService.add({ severity: 'success', summary: 'Success', detail: timesheetMessage.timesheetCreateSuccess });
          this.router.navigate([APP_ROUTES.timeSheets])
        }
      },
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: timesheetMessage.timesheetCreateError, detail: e.error.message });
      }
    })
  }
}
