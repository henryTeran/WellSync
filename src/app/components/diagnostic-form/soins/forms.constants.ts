export const FACIAL_FORM = [
    {
      label: "Quel est votre type de peau ?",
      type: "select",
      controlName: "typePeau",
      options: ["Grasse", "Sèche", "Mixte", "Sensible", "Normale", "Déshydratée"]
    },
    {
      label: "Quels problèmes de peau souhaitez-vous traiter ?",
      type: "checkbox",
      controlName: "problemesPeau",
      options: ["Acné", "Rides", "Taches pigmentaires", "Rougeurs", "Pores dilatés", "Teint terne"]
    },
    {
      label: "Quelle est votre routine actuelle ?",
      type: "checkbox",
      controlName: "routine",
      options: ["Nettoyant", "Sérum", "Crème hydratante", "Crème solaire", "Masque", "Exfoliant"]
    },
    {
      label: "Avez-vous des allergies ou sensibilités cutanées connues ?",
      type: "radio",
      controlName: "allergies",
      options: ["Oui", "Non"]
    },
    {
      label: "Quel est votre objectif principal ?",
      type: "select",
      controlName: "objectif",
      options: ["Hydratation", "Anti-âge", "Éclat", "Apaisement", "Purification", "Nettoyage profond"]
    }
  ];
  
  export const MASSAGE_FORM = [
    {
      label: "Quelles zones sont les plus tendues ou douloureuses ?",
      type: "checkbox",
      controlName: "zonesTension",
      options: ["Dos", "Épaules", "Nuque", "Jambes", "Bras", "Pieds"]
    },
    {
      label: "Quel type de massage préférez-vous ?",
      type: "select",
      controlName: "typeMassage",
      options: ["Relaxant", "Tonique", "Drainant", "Suédois", "Deep Tissue", "Aux pierres chaudes"]
    },
    {
      label: "Avez-vous déjà fait des massages professionnels ?",
      type: "radio",
      controlName: "massagePro",
      options: ["Oui", "Non"]
    },
    {
      label: "Fréquence actuelle des massages ?",
      type: "select",
      controlName: "frequenceMassage",
      options: ["Jamais", "Occasionnellement", "Une fois par mois", "Régulièrement"]
    },
    {
      label: "Objectif principal de ce massage ?",
      type: "select",
      controlName: "objectifMassage",
      options: ["Détente", "Soulagement musculaire", "Améliorer la circulation", "Lymphatique", "Anti-stress"]
    }
  ];
  
  export const CORPS_FORM = [
    {
      label: "Quelles zones souhaitez-vous traiter ?",
      type: "checkbox",
      controlName: "zonesCorps",
      options: ["Ventre", "Cuisses", "Hanches", "Fessiers", "Bras"]
    },
    {
      label: "Quel est votre objectif principal ?",
      type: "select",
      controlName: "objectifCorps",
      options: ["Raffermir", "Réduire le volume", "Atténuer la cellulite", "Lisser la peau", "Détoxifier"]
    },
    {
      label: "Avez-vous déjà suivi des soins minceur ou remodelage ?",
      type: "radio",
      controlName: "soinsCorps",
      options: ["Oui", "Non"]
    },
    {
      label: "Souhaitez-vous utiliser des technologies avancées ?",
      type: "radio",
      controlName: "techno",
      options: ["Oui", "Non", "Je ne sais pas"]
    },
    {
      label: "Faites-vous du sport régulièrement ?",
      type: "select",
      controlName: "sport",
      options: ["Oui", "Non", "Parfois"]
    }
  ];
  
  export const ESTHETIQUE_FORM = [
    {
      label: "Quel type de soin souhaitez-vous ?",
      type: "select",
      controlName: "typeEsthetique",
      options: ["Manucure", "Pédicure", "Pose de gel", "Semi-permanent", "Rehaussement de cils", "Sourcils"]
    },
    {
      label: "Souhaitez-vous un résultat :",
      type: "select",
      controlName: "style",
      options: ["Naturel", "Sophistiqué", "Nail Art", "Coloré"]
    },
    {
      label: "Avez-vous des allergies (colles, résines, vernis) ?",
      type: "radio",
      controlName: "allergiesEsthetique",
      options: ["Oui", "Non"]
    },
    {
      label: "À quelle fréquence réalisez-vous ce type de soin ?",
      type: "select",
      controlName: "frequenceEsthetique",
      options: ["Première fois", "Tous les mois", "Occasionnellement", "Très souvent"]
    },
    {
      label: "Souhaitez-vous une routine beauté à la maison ?",
      type: "radio",
      controlName: "routineMaison",
      options: ["Oui", "Non"]
    }
  ];
  