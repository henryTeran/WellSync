import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from 'firebase/firestore';
import { Auth } from '@angular/fire/auth';
import { AiApiService } from './ai-api.service';
import { EmotionResult } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class EmotionService {
  constructor(
    private readonly firestore: Firestore,
    private readonly auth: Auth,
    private readonly aiApiService: AiApiService,
  ) {}

  async saveEmotionResult(result: EmotionResult): Promise<void> {
    const uid = this.auth.currentUser?.uid;

    if (!uid) {
      throw new Error('Utilisateur non connecté.');
    }

    await addDoc(collection(this.firestore, 'emotionResults'), {
      userId: uid,
      emotion: result.emotion,
      confidence: result.confidence,
      provider: result.provider,
      createdAt: new Date(),
      rawData: result.rawData || null,
    });
  }

  async generateEmotionGuidance(emotion: string): Promise<string> {
    return this.aiApiService.chat(`Utilisateur detecte avec emotion dominante: ${emotion}. Propose un conseil bien-etre.`);
  }
}
