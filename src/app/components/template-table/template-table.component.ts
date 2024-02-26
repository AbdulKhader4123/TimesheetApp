import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Day } from '../../constants';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'template-table',
  standalone: true,
  imports: [ TableModule, FormsModule, CommonModule ],
  templateUrl: './template-table.component.html',
  styleUrl: './template-table.component.scss'
})
export class TemplateTableComponent {
  days!: Day[];
  @Input({ required: true }) templateData: any;
}
