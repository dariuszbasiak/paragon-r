import { Injectable, inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    duration: 5000, // Default duration in ms
    horizontalPosition: 'center' as MatSnackBarHorizontalPosition,
    verticalPosition: 'bottom' as MatSnackBarVerticalPosition,
  };

  showSuccess(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'OK', {
      ...this.defaultConfig,
      panelClass: ['snackbar-success'],
      ...config,
    });
  }

  showError(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'X', {
      ...this.defaultConfig,
      panelClass: ['snackbar-error'],
      ...config,
    });
  }
}
