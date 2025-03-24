import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  
  constructor(private http: HttpClient) {}
  
  async sendMessageToOpenAI(prompt: string): Promise<string> {
      console.log(environment.openAiApiKey);
    const headers = {
      'Authorization': `Bearer ${environment.openAiApiKey}`,
      'Content-Type': 'application/json'
    };

    const body = {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    };

    try {
      const response: any = await this.http.post(this.apiUrl, body, { headers }).toPromise();
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Erreur OpenAI:', error);
      return 'Une erreur est survenue. Veuillez réessayer.';
    }
  }
}
