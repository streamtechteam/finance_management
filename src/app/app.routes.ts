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
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'dashboard/users',
        component: UserManagementComponent,
        children: [
          {
            path: 'dashboard/users/add',
            component: UserAddComponent,
          },
        ],
      },
      {
        path: 'dashboard/users/:id',
        component: UserEditComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
