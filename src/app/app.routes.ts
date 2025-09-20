import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { NotFoundComponent } from './features/notfound/notfound.component';
import { HomeComponent } from './features/home/home-component/home.component';
import { EntityManagementComponent } from './features/dashboard/entity-management/entity-management.component';
import { EntityEditComponent } from './features/dashboard/entity-management/entity-edit/entity-edit.component';
import { RootHomeComponent } from './features/home/root-home.component';
import { RootDashboardComponent } from './features/dashboard/root-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    title: 'Finance Management',
  },
  {
    path: 'dashboard',
    component: RootDashboardComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: ':type',
        component: EntityManagementComponent,
        // title: 'Entity Management',
      },
      {
        path: ':mode/:type/:id',
        component: EntityEditComponent,
        // title: 'Edit',
      },
      {
        path: ':mode/:type',
        component: EntityEditComponent,
        // title: 'Add',
      },
    ],
    title: 'Dashboard',
  },

  {
    path: 'home',
    component: RootHomeComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
      },
      {
        path: '',
        component: HomeComponent,
        title: 'Home',
      },
    ],
    title: 'Home',
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: '404',
  },
];
