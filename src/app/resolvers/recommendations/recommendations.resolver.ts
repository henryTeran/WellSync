import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

export const recommendationsResolver: ResolveFn<any> = async () => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);

  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  const docRef = doc(firestore, `recommendations/${currentUser.uid}`);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() ? docSnap.data() : null;
};
