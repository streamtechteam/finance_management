import { HttpEvent, HttpHandler, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function dataIntercept(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: 'Bearer ' + token }
    });
  }
  return next(req);
}