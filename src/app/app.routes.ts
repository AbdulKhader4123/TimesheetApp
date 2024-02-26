import { Routes } from '@angular/router';
import { TimesheetListPageComponent } from './pages/timesheet-list-page/timesheet-list-page.component';
import { LayoutComponent } from './layout/layout.component';
import { CreateTimeSheetPageComponent } from './pages/create-time-sheet-page/create-time-sheet-page.component';
import { MsalGuard } from '@azure/msal-angular';
import { LoginFailedPageComponent } from './pages/login-failed-page/login-failed-page.component';
import { APP_ROUTES } from './constants';
import { RoleAuthGuard } from './guards/role-auth.guard';
import { TemplateListPageComponent } from './pages/template-list-page/template-list-page.component';
import { TemplateDetailComponent } from './pages/template-detail/template-detail.component';
import { TimesheetDetailComponent } from './pages/timesheet-detail/timesheet-detail.component';
import { ApprovalsComponent } from './pages/approvals/approvals.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: APP_ROUTES.timeSheets },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: APP_ROUTES.timeSheets,
                component: TimesheetListPageComponent
            },
            {
                path: `${APP_ROUTES.timeSheets}/:id`,
                component: TimesheetDetailComponent
            },
            {
                path: APP_ROUTES.templates,
                component: TemplateListPageComponent
            },
            {
                path: `${APP_ROUTES.templates}/:id`,
                component: TemplateDetailComponent
            },
            {
                path: APP_ROUTES.createTimeSheet,
                component: CreateTimeSheetPageComponent,
                canActivate: [RoleAuthGuard]
            },
            {
                path: APP_ROUTES.approvals,
                component: ApprovalsComponent
            }
        ],
        canActivate: [MsalGuard]
    },
    {
        path: 'login-failed',
        component: LoginFailedPageComponent
    },
    { path: '**', pathMatch: 'full', redirectTo: APP_ROUTES.timeSheets },
];
