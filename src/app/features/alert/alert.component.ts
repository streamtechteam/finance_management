import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { AlertConfig } from '../../shared/alert.interface';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/input';

@Component({
  selector: 'app-material-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  imports: [MatDialogContent , MatIcon , MatFormField , MatDialogActions , MatDialogClose],
})
export class MaterialAlertComponent {
  @ViewChild('inputField', { static: false }) inputField!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<MaterialAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertConfig
  ) {}

  get showInput(): boolean {
    return !!this.data.inputType;
  }

  getIconName(): string {
    switch (this.data.icon) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return '';
    }
  }

  getButtonColor(): 'primary' | 'accent' | 'warn' {
    switch (this.data.icon) {
      case 'success':
        return 'primary';
      case 'error':
        return 'warn';
      case 'warning':
        return 'accent';
      default:
        return 'primary';
    }
  }

  onConfirm(): void {
    if (this.showInput && this.inputField) {
      const value = this.inputField.nativeElement.value;
      this.dialogRef.close(value || null);
    }
  }
}
