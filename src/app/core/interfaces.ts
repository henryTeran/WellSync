export type ThemeType = 'alimentation' | 'sport' | 'soins';

export interface UserProfile {
  uid: string;
  email?: string | null;
  role: 'user' | 'admin';
  anonymous?: boolean;
  fcmToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Recommendation {
  id?: string;
  userId?: string;
  theme: ThemeType;
  titre: string;
  description: string;
  source?: 'ai' | 'manual';
  diagnosticId?: string;
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SportRecommendation extends Recommendation {
  routine: {
    jours: {
      jour: string;
      exercices: {
        nom: string;
        repetitions: string;
        zoneCiblee: string;
        image?:string;
        tempsEntrainement:string
      }[];
    }[];
  };
}

  
export interface AlimentationRecommendation extends Recommendation {
  imageUrl: string;
  bienfaits: string;
  jours: {
    jour: string;
    repas: {
      nom: string;
      quantite: string;
      ingredients: string[];
      instructions: string;
      tempsPreparation?: string;
    }[];
  }[];
}

export interface SoinsRecommendation extends Recommendation {
  prestation: {
    nom: string;
    duree: string;
    bienfaits: string[];
    protocole: string;
    appareillage: string;
    nomTechnique: string;
    nomCremes: string;
  };
  institutPropose: string;
  adresseInstitut: string;
}

export interface DiagnosticSport {
  poids: string;
  taille: string;
  objectifs: string[];
  zones: string[];
  sports: string[];
  niveau: string;
  frequence: string;
  duree: string;
  equipements: string[];
  rappelHoraire?: string;
}

export interface DiagnosticAlimentation {
  poids: string;
  taille: string;
  age: string;
  sexe: string;
  objectifs: string[];
  preferenceRecommandation: string;
  regimes: string[];
  tempsPreparation: string;
  nbRepasJour: string;
  grignotage: string;
  rappelHoraire?: string;
}

export interface DiagnosticSoins {
  typeSoin: string;
  rappelHoraire?: string;
  [key: string]: unknown;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  provider: 'luxand';
  rawData?: unknown;
}

export interface ChatMessage {
  id?: string;
  userId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
  contextType?: string;
}

export type FoodRecommendation = AlimentationRecommendation;
export type CareRecommendation = SoinsRecommendation;

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
  details?: unknown;
  }
  