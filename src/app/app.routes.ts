import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { NotFoundComponent } from './features/notfound/notfound.component';
import { HomeComponent } from './features/home/home.component';
import { UserManagementComponent } from './features/dashboard/user-management/user-management.component';
import { UserEditComponent } from './features/dashboard/user-management/user-edit/user-edit.component';
import { UserAddComponent } from './features/dashboard/user-management/user-add/user-add.component';

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
    path: 'dashboard/users',
    component: UserManagementComponent,
    title: 'User Management',
  },
  {
    path: 'dashboard/users/add',
    component:UserAddComponent,
    title: 'Add User',
  },
  {
    path: 'dashboard/users/:id',
    component: UserEditComponent,
    title: 'Edit User',
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
