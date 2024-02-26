import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Day } from '../../constants';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'time-sheet-table',
  standalone: true,
  imports: [ TableModule, FormsModule, CommonModule ],
  templateUrl: './time-sheet-table.component.html',
  styleUrl: './time-sheet-table.component.scss'
})
export class TimeSheetTableComponent {
  days!: Day[];
  @Input({ required: true }) timesheetData: any;
  @Input({ required: true }) editable = false;

  hourChanged(day:any){
    const total = (day.normal_worked_hours || 0) + (day.overtime || 0) - (day.sick || 0) - (day.planned_leave || 0);
    total >= 0 ? day.total_hours = total : day.total_hours = 0;
  }
}
