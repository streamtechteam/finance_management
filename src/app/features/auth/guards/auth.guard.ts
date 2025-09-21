// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { BASEURL } from '../../../network.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private httpClient: HttpClient) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Check if user is authenticated
    const isAuthenticated = this.checkAuth();

    if (isAuthenticated) {
      return true;
    } else {
      // Redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }

  private checkAuth(): boolean {
    // fetch(`${BASEURL}/api/me`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //     if (data.status === 200) {
    //       localStorage.setItem('token', data.token);
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   });
    this.httpClient.get(`${BASEURL}/api/me`).subscribe({
      next: (res) => {
        console.log(res);
        return true;
      },
      error(err) {
          console.log(err)
      },
    });
    // Your authentication logic here
    return !!localStorage.getItem('token');
  }
}
