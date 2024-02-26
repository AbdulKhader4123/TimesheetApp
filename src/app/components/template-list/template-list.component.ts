import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'template-list',
  standalone: true,
  imports: [ TableModule, FormsModule, CommonModule, RouterModule ],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.scss'
})
export class TemplateListComponent {
  @Input({ required: true }) templates: any;

}
