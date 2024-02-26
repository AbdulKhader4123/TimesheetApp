import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { APP_ROLES } from '../constants';

export const RoleAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(MsalService);

  let activeAccount = authService.instance.getActiveAccount();
  if (activeAccount?.idTokenClaims?.roles?.includes(APP_ROLES.Admin)) {
    return true;
  } else {
    return false;
  }
};
