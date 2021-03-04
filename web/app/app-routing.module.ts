// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// auth guard
import { AuthGuard } from './guards/auth.guard'

// Layouts
import { LayoutLoginComponent } from './components/shared/layout-login/layout-login.component';
import { LayoutMainComponent } from './components/shared/layout-main/layout-main.component';

// Pages
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { LoginComponent } from './components/user/login/login.component'


// LayoutLogin - public layout
const PUBLIC_ROUTES: Routes = [
    { path: '', component: LoginComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent }
];

// LayoutMain - private layout
const PRIVATE_ROUTES: Routes = [
    { path: 'dashboard', component: DashboardComponent }
];

// Holds both public and private routes, only desides which layout to use
const routes: Routes = [
    { path: '', component: LayoutLoginComponent, data: { title: 'Public Views' }, children: PUBLIC_ROUTES },
    { path: '', component: LayoutMainComponent, canActivate: [AuthGuard], data: { title: 'Secure Views' }, children: PRIVATE_ROUTES }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
