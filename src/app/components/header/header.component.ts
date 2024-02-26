import { Component, inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { LayoutService } from '../../service/layout.service';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ MenubarModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private _layoutService = inject(LayoutService);
  private _authService = inject(MsalService);

  logout() {
    this._authService.logoutRedirect();
  }

  toggleMenu(){
    this._layoutService.toggleMenu();
  }
}
