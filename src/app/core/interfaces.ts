export interface Recommendation {
    theme: 'alimentation' | 'sport' | 'soins';
    titre: string;
    description: string;
    date: Date;


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

  interface Repas {
    nom: string;
    ingredients: string[];
    instructions: string;
  }
  
  interface Jour {
    jour: string;
    repas: Repas[];
  }
  