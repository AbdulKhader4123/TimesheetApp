
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { API_PATHS, Day, Template } from '../constants';
import { basePath_URL } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService {

    private _http = inject(HttpClient)
    private readonly _templateUrl = `${basePath_URL}${API_PATHS.TimeSheetTemplate}`;
    private readonly _timesheetUrl = `${basePath_URL}${API_PATHS.TimeSheet}`;
    private readonly _timesheetApprovalUrl = `${basePath_URL}${API_PATHS.TimeSheet}/approvals`;
    private timeSheetRefreshSubject$ =  new Subject<void>();
    timeSheetRefreshObervable$ =  this.timeSheetRefreshSubject$.asObservable();


  createTimeSheetTemplate(templateData: Template): Observable<any> {
    return this._http.post(this._templateUrl, templateData)
  }

  getTimeSheetTemplates(params: any): Observable<any> {
    return this._http.get(this._templateUrl, {
      params: params
    })
  }

  getTimeSheetTemplate(templateId: string): Observable<any> {
    return this._http.get(`${this._templateUrl}/${templateId}`)
  }

  createTimeSheet(templateId: string): Observable<any> {
    return this._http.post(this._timesheetUrl, {templateId})
  }

  getTimeSheets(params: any): Observable<any> {
    return this._http.get(this._timesheetUrl, {
      params: params
    })
  }

  getTimeSheet(timesheetId: string): Observable<any> {
    return this._http.get(`${this._timesheetUrl}/${timesheetId}`)
  }

  updateTimeSheet(timesheetData: {timesheetId: string, days?: Day[], approver?: string, reviewer?: string, status?: string}): Observable<any> {
    return this._http.put(`${this._timesheetUrl}/${timesheetData.timesheetId}`, 
    {
      ...(timesheetData.days ? 
        { 
          days: timesheetData.days, 
        } : {}),
      ...(timesheetData.approver ? 
        { 
          approver: timesheetData.approver,
        } : {}),
      ...(timesheetData.reviewer ? 
        { 
          reviewer: timesheetData.reviewer
        } : {}),
      ...(timesheetData.status ? 
        { 
          status: timesheetData.status, 
        } : {}),
    })
  }

  refreshTimeSheets(){
    this.timeSheetRefreshSubject$.next();
  }

  getTimeSheetsForApprovals(): Observable<any>{
    return this._http.get(this._timesheetApprovalUrl)
  }
  updateTimeSheetStatus(timesheetData: {timesheetId: string, comments?: string, status: string}): Observable<any> {
    return this._http.put(`${this._timesheetApprovalUrl}/${timesheetData.timesheetId}`, 
    {
      ...(timesheetData.comments ? 
        { 
          comments: timesheetData.comments, 
        } : {}),
      ...(timesheetData.status ? 
        { 
          status: timesheetData.status,
        } : {})
    })
  }

}