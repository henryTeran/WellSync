import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, take } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';
import { ApiSuccessResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class EmotionDetectionService {
  private readonly apiUrl = `${environment.backendUrl}/api/emotion/detect`;

  constructor(
    private readonly http: HttpClient,
    private readonly auth: Auth,
  ) {}

  private toBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';

    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    return btoa(binary);
  }

  async detectEmotions(file: File | string): Promise<unknown> {
    const user = this.auth.currentUser || await firstValueFrom(authState(this.auth).pipe(take(1)));

    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    const idToken = await user.getIdToken(true);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    });

    let imageBase64 = '';
    let mimeType = 'image/png';

    if (typeof file === 'string') {
      imageBase64 = file;
    } else {
      const arrayBuffer = await file.arrayBuffer();
      imageBase64 = this.toBase64(arrayBuffer);
      mimeType = file.type || mimeType;
    }

    const request = this.http.post<ApiSuccessResponse<unknown>>(this.apiUrl, {
      imageBase64,
      mimeType,
    }, {
      headers,
    });

    const response = await firstValueFrom(request);
    return response.data;
  }
}
