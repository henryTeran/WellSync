import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = environment.openAiApiKey; // 🔥 Vérifie que l'API Key est bien définie

  constructor(private http: HttpClient, private firestore: Firestore) {}

  sendMessageToOpenAI(message: string): Observable<string> {
    if (!this.apiKey) {
      console.error("Erreur: La clé API OpenAI n'est pas définie.");
      return throwError(() => new Error("Clé API manquante. Vérifiez votre configuration."));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const body = {
      model: 'gpt-4o',  // Assurez-vous que votre compte a accès à ce modèle
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => response.choices?.[0]?.message?.content || "Aucune réponse reçue."),
      catchError(error => {
        console.error('Erreur lors de la requête OpenAI:', error);
        let errorMessage = "Une erreur est survenue lors de la communication avec OpenAI.";

        if (error.status === 429) {
          errorMessage = "Quota dépassé. Vérifiez votre compte OpenAI.";
        } else if (error.status === 401) {
          errorMessage = "Clé API invalide. Vérifiez votre environnement.";
        } else if (error.error?.error?.code === 'model_not_found') {
          errorMessage = "Modèle non disponible. Vérifiez l'accès à l'API.";
        } else if (error.status >= 500) {
          errorMessage = "Problème côté OpenAI. Réessayez plus tard.";
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  saveMessage(userId: string, userMessage: string, botMessage: string) {
    const messagesRef = collection(this.firestore, `users/${userId}/messages`);
    return addDoc(messagesRef, {
      userMessage,
      botMessage,
      timestamp: new Date(),
    });
  }
}
