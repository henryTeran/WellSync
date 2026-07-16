import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AuthService } from './auth.service';
import { Recommendation, ThemeType } from '../interfaces';
import { AiApiService } from './ai-api.service';
import { RecommendationService } from './recommendation.service';
import { DiagnosticService } from './diagnostic.service';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {
  constructor(
    private readonly authService: AuthService,
    private readonly aiApiService: AiApiService,
    private readonly recommendationService: RecommendationService,
    private readonly diagnosticService: DiagnosticService,
    private readonly chatService: ChatService,
  ) {}

  sendMessageToOpenAI(message: string): Observable<string> {
    return from(this.aiApiService.chat(message));
  }

  async saveMessage(userId: string, userMessage: string, botMessage: string): Promise<void> {
    await this.chatService.saveMessage(userId, 'user', userMessage, 'chat');
    await this.chatService.saveMessage(userId, 'assistant', botMessage, 'chat');
  }

  async saveRecommendation(userId: string, recommendation: Recommendation): Promise<void> {
    await this.recommendationService.saveRecommendation(userId, recommendation);
  }

  async saveDiagnostic(userId: string, diagnostic: Record<string, unknown>, type: ThemeType = 'sport'): Promise<string> {
    return this.diagnosticService.saveDiagnostic(userId, type, diagnostic);
  }

  async enrichirAvecDiagnostic(
    userId: string,
    diagnostic: Record<string, unknown>,
    theme: ThemeType,
  ): Promise<Recommendation> {
    const recommendation = await this.aiApiService.createRecommendation(theme, diagnostic);
    return {
      ...recommendation,
      theme,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'ai',
    };
  }

  async getLastRecommendation<T>(userId: string, theme: ThemeType): Promise<T> {
    const currentUser = this.authService.currentUser();

    if (!currentUser || currentUser.uid !== userId) {
      throw new Error('Accès non autorisé à ce compte.');
    }

    const recommendation = await this.recommendationService.getLastRecommendation<T>(userId, theme);

    if (!recommendation) {
      throw new Error('Aucune recommandation trouvée pour ce thème.');
    }

    return recommendation;
  }

  async envoyerEmotionEtRecevoirRecommandation(emotion: string): Promise<string> {
    return this.aiApiService.chat(`Emotion dominante detectee: ${emotion}. Fournis un conseil bien-etre adapte.`);
  }

  async saveMessageGrouped(userId: string, userMessage: string, botMessage: string, emotionTag?: string): Promise<void> {
    const contextType = emotionTag ? `emotion:${emotionTag}` : 'chat';
    await this.chatService.saveMessage(userId, 'user', userMessage, contextType);
    await this.chatService.saveMessage(userId, 'assistant', botMessage, contextType);
  }

  async getMessagesForUser(userId: string): Promise<{ sender: string; text: string }[]> {
    return this.chatService.getMessagesForUser(userId);
  }
}
