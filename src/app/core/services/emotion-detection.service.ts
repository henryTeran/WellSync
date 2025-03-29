import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmotionDetectionService {
  private API_TOKEN = environment.luxandApiToken;
  private API_URL = 'https://api.luxand.cloud/photo/emotions';

  async detectEmotions(file: File | string): Promise<any> {
    const headers = new Headers();
    headers.append('token', this.API_TOKEN);

    const formData = new FormData();
    if (typeof file === 'string' && file.startsWith('https://')) {
      formData.append('photo', file);
    } else {
      if (file instanceof File) {
        formData.append('photo', file, 'file');
      } else {
        throw new Error('Invalid file type: expected a File instance.');
      }
    }

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers,
      body: formData,
    });

    return response.json();
  }
}
