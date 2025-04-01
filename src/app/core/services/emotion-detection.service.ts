import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmotionDetectionService {
  private API_TOKEN = environment.luxandApiToken;
  private API_URL = 'https://api.luxand.cloud/photo/emotions';

  constructor(private readonly http : HttpClient){}

  async detectEmotions(file: File | string): Promise<any> {
    const headers = new HttpHeaders().set('token', this.API_TOKEN);

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

    // const request = await this.http.get(this.API_URL, {
    //   method: 'POST',
    //   headers,
    //   body: formData,
    // });

    const request = await this.http.post(this.API_URL, formData, {
      headers,
    });

    const response = await firstValueFrom(request);

    return response;
  }
}
