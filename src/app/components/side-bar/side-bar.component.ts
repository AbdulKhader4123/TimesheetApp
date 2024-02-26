import { Component, ViewChild, inject } from '@angular/core';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { LayoutService } from '../../service/layout.service';
import { MsalService } from '@azure/msal-angular';
import { APP_ROLES } from '../../constants';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ SidebarModule, RippleModule, ButtonModule, RouterModule, CommonModule ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  layoutService = inject(LayoutService);
  _router = inject(Router);
  _authService = inject(MsalService);
  userRoles: string[] | undefined = [];
  APP_ROLES = APP_ROLES;

  ngOnInit(){
    this.userRoles = this._authService.instance.getActiveAccount()?.idTokenClaims?.roles;
  }

  closeCallback(e: any): void {
      this.sidebarRef.close(e);
  }

  onHide(): void {
    this.layoutService.toggleMenu();
  }

  navigateTo(e: any, route: string){
    this._router.navigate([route])
    this.closeCallback(e)
  }
}
