import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { DiagnosticAlimentation, DiagnosticSoins, DiagnosticSport, ThemeType } from '../interfaces';

export type DiagnosticPayload = DiagnosticSport | DiagnosticAlimentation | DiagnosticSoins | Record<string, unknown>;

@Injectable({
  providedIn: 'root',
})
export class DiagnosticService {
  constructor(private readonly firestore: Firestore) {}

  async saveDiagnostic(userId: string, type: ThemeType, answers: DiagnosticPayload): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, 'diagnostics'), {
      userId,
      type,
      answers,
      createdAt: new Date(),
    });

    return docRef.id;
  }

  async getLastDiagnostic(userId: string): Promise<Record<string, unknown> | null> {
    const snapshot = await getDocs(
      query(
        collection(this.firestore, 'diagnostics'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(1),
      ),
    );

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data() as Record<string, unknown>;
  }
}
