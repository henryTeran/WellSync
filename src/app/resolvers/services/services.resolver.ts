
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

export const servicesResolver: ResolveFn<any[]> = async () => {
  const firestore = inject(Firestore);
  const snapshot = await getDocs(collection(firestore, 'services'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
