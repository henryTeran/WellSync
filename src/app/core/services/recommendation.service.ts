import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { Recommendation, ThemeType } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  constructor(private readonly firestore: Firestore) {}

  async saveRecommendation(userId: string, recommendation: Recommendation): Promise<void> {
    await addDoc(collection(this.firestore, 'recommendations'), {
      ...recommendation,
      userId,
      source: recommendation.source || 'ai',
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date(),
    });
  }

  async getLastRecommendation<T>(userId: string, theme: ThemeType): Promise<T | null> {
    const snapshot = await getDocs(
      query(
        collection(this.firestore, 'recommendations'),
        where('userId', '==', userId),
        where('theme', '==', theme),
        orderBy('createdAt', 'desc'),
        limit(1),
      ),
    );

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data() as T;
  }

  async getAllByUser<T>(userId: string): Promise<T[]> {
    const snapshot = await getDocs(
      query(
        collection(this.firestore, 'recommendations'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
      ),
    );

    return snapshot.docs.map((item) => item.data() as T);
  }
}
