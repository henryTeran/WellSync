import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, Recommendation, ThemeType } from '../interfaces';
import { firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiApiService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly baseUrl = `${environment.backendUrl}/api`;

  private async buildAuthHeaders(): Promise<HttpHeaders> {
    const user = this.auth.currentUser || await firstValueFrom(authState(this.auth).pipe(take(1)));

    if (!user) {
      throw new Error('Utilisateur non connecté.');
    }

    const token = await user.getIdToken(true);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  async createRecommendation(theme: ThemeType, diagnostic: Record<string, unknown>): Promise<Recommendation> {
    const headers = await this.buildAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ApiSuccessResponse<Recommendation>>(
        `${this.baseUrl}/ai/recommendation`,
        { theme, diagnostic },
        { headers },
      ),
    );

    return response.data;
  }

  async chat(message: string): Promise<string> {
    const headers = await this.buildAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ApiSuccessResponse<{ content: string }>>(
        `${this.baseUrl}/ai/chat`,
        { message },
        { headers },
      ),
    );

    return response.data.content;
  }
}
