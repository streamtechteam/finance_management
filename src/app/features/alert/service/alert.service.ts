import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MaterialAlertComponent } from '../alert.component';
import { AlertConfig } from '../../../shared/alert.interface';

export interface AlertResult {
  isConfirmed: boolean;
  value?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MaterialAlertService {
  constructor(private dialog: MatDialog) {}

  private openDialog(config: AlertConfig): Observable<AlertResult> {
    return this.dialog
      .open(MaterialAlertComponent, {
        data: config,
        width: '400px',
        maxWidth: '95vw',
        disableClose: false,
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        map((result) => {
          // If user clicks confirm → result = input value (or true if no input)
          // If user cancels or closes → result = false
          if (result === undefined || result === false) {
            return { isConfirmed: false };
          }
          return {
            isConfirmed: true,
            value: typeof result === 'string' ? result : null,
          };
        })
      );
  }

  success(title: string, message: string = ''): Observable<AlertResult> {
    return this.openDialog({
      title,
      message,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  error(title: string, message: string = ''): Observable<AlertResult> {
    return this.openDialog({
      title,
      message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

  warning(title: string, message: string = ''): Observable<AlertResult> {
    return this.openDialog({
      title,
      message,
      icon: 'warning',
      confirmButtonText: 'OK',
    });
  }

  info(title: string, message: string = ''): Observable<AlertResult> {
    return this.openDialog({
      title,
      message,
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }

  confirm(
    title: string,
    message: string = '',
    confirmText: string = 'Yes',
    cancelText: string = 'No'
  ): Observable<AlertResult> {
    return this.openDialog({
      title,
      message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    });
  }

  prompt(
    title: string,
    message: string = '',
    placeholder: string = '',
    inputType: 'text' | 'email' | 'password' = 'text',
    initialValue: string = ''
  ): Observable<AlertResult> {
    return this.openDialog({
      title,
      message,
      inputType,
      inputPlaceholder: placeholder,
      inputValue: initialValue,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
    });
  }
}
