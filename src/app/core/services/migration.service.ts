import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  constructor(private firestore: Firestore) {}

  async migrateData(): Promise<void> {
    const usersRef = collection(this.firestore, 'users');
    const usersSnap = await getDocs(usersRef);

    for (const userDoc of usersSnap.docs) {
      const userId = userDoc.id;
      const userPath = `users/${userId}`;

      // Subcollections à migrer
      const subcollections = ['diagnostic', 'messages', 'recommendations'];

      for (const subcollectionName of subcollections) {
        const subRef = collection(this.firestore, `users/${userId}/${subcollectionName}`);
        const subSnap = await getDocs(subRef);

        for (const docSnap of subSnap.docs) {
          const data = docSnap.data();

          // Ajout du userId dans le document migré
          const newData = {
            ...data,
            userId: userId
          };

          // Ajout dans la nouvelle collection root
          await addDoc(collection(this.firestore, subcollectionName), newData);
            // Suppression du document dans la sous-collection
          await deleteDoc(doc(this.firestore, `${userPath}/${subcollectionName}/${docSnap.id}`));
       
        }
        console.log(`Migration + suppression de '${subcollectionName}' pour user ${userId}`);
 
      }
    }

    console.log('Migration terminée !');
  }
}
