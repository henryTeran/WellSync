import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, getDocs, limit, orderBy, query, setDoc, where } from 'firebase/firestore';
import { Recommendation } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = environment.openAiApiKey; 
  
  constructor(private http: HttpClient, private firestore: Firestore) {}
  
  sendMessageToOpenAI(message: string): Observable<string> {
  //  console.log(this.apiKey);
    if (!this.apiKey) {
      console.error("Erreur: La clé API OpenAI n'est pas définie.");
      return throwError(() => new Error("Clé API manquante. Vérifiez votre configuration."));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const body = {
      model: 'gpt-4o',  
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
    const messagesRef = collection(this.firestore, `messages`);
    return addDoc(messagesRef, {
      userMessage,
      botMessage,
      date: new Date(),
      userId: userId
    });
  }

  saveRecommendation(userId: string, recommendation: Recommendation) {
    const ref = collection(this.firestore, `recommendations`);
    return addDoc(ref, {
      ...recommendation,
      date: new Date(),
      userId: userId
    });
  }

  saveDiagnostic(userId: string, diagnostic: any) {
    const ref = collection(this.firestore, `diagnostic`);
    return addDoc(ref, {
      ...diagnostic,
      date: new Date(),
      userId: userId
    });
  }

  async enrichirAvecDiagnostic(
    userId: string,
    diagnostic: any,
    theme: 'sport' | 'alimentation' | 'soins'
  ): Promise<Recommendation> {
    const basePrompt = `Voici les réponses du formulaire d’un utilisateur pour le thème "${theme}":\n${JSON.stringify(diagnostic, null, 2)}\n`;
  
    let prompt = '';
  
    if (theme === 'sport') {
      const nbJours = this.getTrainingDays(diagnostic.frequence); // ex: 3 jours par semaine
      prompt = `
  ${basePrompt}
Génère un programme de sport adapté aux réponses ci-dessus, avec ${nbJours} jours d'entraînement par semaine.

Retour attendu au format JSON STRICT, avec cette structure :

{
  "theme": "sport",
  "titre": "Programme personnalisé",
  "description": "Courte description du programme",
  "routine": {
    "jours": [
      {
        "jour": "Lundi",
        "exercices": [
          { "nom": "...", "repetitions": "...", "zoneCiblee": "..." },
          ...
        ]
      },
      ...
    ]
  }
}

⚠️ Ne place surtout **pas** le champ "jour" à l’intérieur d’un exercice. Il doit être **au même niveau que le tableau "exercices"**.
Réponds uniquement avec un JSON strict. Pas de commentaires, pas de texte autour.
`;
    } else if (theme === 'alimentation') {
      prompt = `
    ${basePrompt}
    
    Génère une recommandation alimentaire personnalisée selon les objectifs et contraintes alimentaires de l’utilisateur.
    
    📅 Si la préférence est « Trois repas par jour » ou « plan pour la semaine », structure par jour (Lundi à Dimanche si nécessaire).
    Inclure pour chaque jour :
    - jour: « Lundi »
    - repas: [
        { nom, quantite, ingredients, instructions }
      ]
    
    📦 Structure JSON attendue :
    {
      "theme": "alimentation",
      "titre": "...",
      "description": "...",
      "imageUrl": "...",
      "bienfaits": "...",
      "jours": [
        {
          "jour": "Lundi",
          "repas": [
            {
              "nom": "Poulet rôti aux légumes",
              "quantite": "1 portion",
              "ingredients": [
                "150g de poulet",
                "100g de carottes",
                "1 c. à soupe d’huile d’olive"
              ],
              "instructions": "Cuire le poulet au four pendant 25 min avec les légumes."
            }
          ]
        }
      ]
    }
    
    🚫 Ne commente rien, ne retourne que du JSON strict.
      `;
    }else if (theme === 'soins') {
      prompt = `
  ${basePrompt}
  Génère un soin bien-être personnalisé selon les besoins exprimés.
  
  Structure attendue :
  {
    "theme": "soins",
    "titre": "...",
    "description": "...",
    "prestation": "...",
    "institutPropose": "..."
  }
  
  Ne commente rien, retourne uniquement un JSON valide.
  `;
    }
  
    const response = await lastValueFrom(this.sendMessageToOpenAI(prompt));
  
    try {
      const cleaned = response
        .replace(/```json/i, '')
        .replace(/```/g, '')
        .trim();
  
      const recommendation: Recommendation = JSON.parse(cleaned);
      recommendation.date = new Date();
      return recommendation;
    } catch (e) {
      console.error("Erreur lors du parsing de la réponse IA :", e, response);
      throw new Error("Impossible d’analyser la recommandation IA.");
    }
  }
  
  
  async getLastRecommendation<T>(userId: string, theme: 'sport' | 'alimentation' | 'soins'): Promise<T> {
    const ref = collection(this.firestore, `recommendations`);
<<<<<<< HEAD
    const q = query(ref, where('theme', '==', theme), orderBy('date', 'desc'), limit(1));
=======
    const q = query(ref, where('theme', '==', theme), where('userId', '==', userId),  orderBy('date', 'desc'), limit(1));
    console.log(`[getLastRecommendation] UID: ${userId} | Thème: ${theme}`);
    console.log(`[getLastRecommendation] Requête :`, q);
>>>>>>> 30d0f9094b61589c63b20764839597bb9107608f
    const snapshot = await getDocs(q);
    console.log(`[getLastRecommendation] Nombre de documents trouvés :`, snapshot.size);
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as T;
    } else {
      throw new Error("Aucune recommandation trouvée pour ce thème.");
    }
  }
  
  private getTrainingDays(freq: string): number {
    const map = {
      '1 fois': 1,
      '2 à 3 fois': 3,
      '4 à 5 fois': 5,
      '6 à 7 fois': 6
    };
    return (map as any)[freq] || 3;

  }
}
