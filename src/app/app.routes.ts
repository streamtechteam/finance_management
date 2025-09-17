import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { NotFoundComponent } from './features/notfound/notfound.component';
import { HomeComponent } from './features/home/home.component';
import { EntityManagementComponent } from './features/dashboard/entity-management/entity-management.component';
import { EntityEditComponent } from './features/dashboard/entity-management/entity-edit/entity-edit.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    title: 'Finance Management',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
  },
  {
    path: 'dashboard/:type',
    component: EntityManagementComponent,
    // title: 'Entity Management',
  },
  {
    path: 'dashboard/:mode/:type/:id',
    component: EntityEditComponent,
    // title: 'Edit',
  },
  {
    path: 'dashboard/:mode/:type',
    component: EntityEditComponent,
    // title: 'Add',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: '404',
  },
];
