import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private readonly toastController: ToastController) {}

  async showUserError(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      color: 'danger',
      duration: 3500,
      position: 'top',
    });

    await toast.present();
  }

  logDevError(context: string, error: unknown): void {
    if (!environment.production) {
      console.error(`[${context}]`, error);
    }
  }

  normalizeErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'string' && error.trim()) {
      return error;
    }

    if (error && typeof error === 'object' && 'message' in error) {
      const message = String((error as { message?: unknown }).message ?? '').trim();
      if (message) {
        return message;
      }
    }

    return fallback;
  }
}
