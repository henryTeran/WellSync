import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, getDocs, limit, orderBy, query, setDoc, where } from 'firebase/firestore';
import { Recommendation } from '../interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = environment.openAiApiKey; 
  
  constructor(
    private http: HttpClient, 
    private firestore: Firestore,
    private _authservice: AuthService) {}
  
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
          { "nom": "...", "repetitions": "...", "zoneCiblee": "...", "tempsEntrainement": "..."},
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
              "tempsReparation: "45 min de préparation"
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
    
    Analyse les réponses de l'utilisateur pour générer une **fiche de soin professionnelle personnalisée**, en adaptant le contenu selon le **type de soin détecté** (visage, massage, remodelage du corps, ou esthétique).
    
    🔍 Étape 1 : Identifier le type de soin selon les réponses :
    - Si des termes comme "taches", "acné", "rides", "peau", "hydratation" apparaissent → soin visage
    - Si des zones comme "dos", "nuque", "jambes", "tensions", "détente" sont citées → massage bien-être
    - Si "cellulite", "ventre", "raffermir", "cuisses", "fessiers" apparaissent → remodelage / soin corps
    - Si "vernis", "ongles", "cils", "sourcils", "manucure", "nail art" apparaissent → soin esthétique
    
    ---
    
    📝 Résumé des besoins :
    - Problèmes esthétiques ou tensions perçues
    - Objectifs bien-être ou beauté
    - Zones concernées
    
    ---
    
    💆‍♀️ Recommandation adaptée au type :
    - Nom du soin
    - Description du soin et pourquoi il est adapté
    - Durée approximative
    - Bienfaits attendus
    
    ---
    
    📋 Protocole professionnel (ajusté selon le type) :
    
    👉 Si soin visage :
    - Démaquillage
    - Diagnostic de peau
    - Gommage
    - Vapeur / VapoZone
    - Extraction si besoin
    - Appareils spécifiques
    - Massage
    - Masque
    - Soin final (crème, sérum, protection)
    
    👉 Si massage :
    - Type de massage recommandé
    - Zones ciblées
    - Techniques de relaxation ou de drainage
    - Durée et ambiance
    - Bienfaits ressentis
    
    👉 Si soin remodelage corps :
    - Zones à traiter (ventre, fessiers, cuisses…)
    - Technologies recommandées (radiofréquence, cryo, etc.)
    - Techniques manuelles
    - Objectif (minceur, raffermissement, drainage)
    
    👉 Si soin esthétique (manucure, cils, sourcils…) :
    - Prestation recommandée
    - Style et finition
    - Produits utilisés (gel, vernis, sérum)
    - Conseils post-soin
    
    ---
    
    💡 Détails produits et techniques :
    - Appareillage ou outils spécifiques
    - Noms des techniques (drainage, pressothérapie, modelage relaxant…)
    - Produits utilisés (sérum, crèmes, huiles, vernis, etc.)
    
    ---
    
    📍 Institut suggéré :
    - Type d’établissement (spa, institut dermatologique, onglerie, centre minceur, etc.)
    - Localisation (ville ou quartier)
    
    ---
    
    📦 Format de sortie (JSON strict) :
    {
      "theme": "soins",
      "titre": "Nom du soin",
      "description": "Pourquoi ce soin est recommandé",
      "prestation": {
        "nom": "Nom du soin",
        "duree": "Ex : 75 min",
        "bienfaits": ["...", "..."],
        "protocole": "Protocole détaillé adapté",
        "appareillage": "...",
        "nomTechnique": "...",
        "nomCremes": "..."
      },
      "institutPropose": "Nom ou type d’établissement",
      "adresseInstitut": "Ville ou quartier"
    }
    
    ⚠️ Ne commente rien. Retourne uniquement du JSON strictement valide.
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
    const currentUser = this._authservice.currentUser;
  
    if (!currentUser) {
      throw new Error('Utilisateur non connecté.');
    }
  
    if (currentUser.uid !== userId) {
      throw new Error("Accès non autorisé à ce compte.");
    }
  
    const ref = collection(this.firestore, `recommendations`);
    const q = query(
      ref,
      where('theme', '==', theme),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(1)
    );
  
    const snapshot = await getDocs(q);
    console.log(`[getLastRecommendation] Documents trouvés : ${snapshot.size}`);
  
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
