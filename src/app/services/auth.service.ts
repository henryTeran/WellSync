import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private userSubject = new BehaviorSubject<User | null>(null);
  private roleSubject = new BehaviorSubject<string | null>(null); 

  user$: Observable<User | null> = this.userSubject.asObservable();
  role$: Observable<string | null> = this.roleSubject.asObservable(); 

  constructor() {
    this.auth.onAuthStateChanged(async (user) => {
      this.userSubject.next(user);
      if (user) {
        const role = await this.getUserRole(user.uid);
        this.roleSubject.next(role);
      } else {
        this.roleSubject.next(null);
      }
    });
  }

  async register(email: string, password: string, role: 'user' | 'admin' = 'user'): Promise<User | null> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = credential.user;
      
      if (user) {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userRef, { email: user.email, role });

        this.roleSubject.next(role);
      }

      this.userSubject.next(user);
      return user;
    } catch (error) {
      console.error("Erreur d'inscription :", (error as Error).message);
      return null;
    }
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = credential.user;

      if (user) {
        const role = await this.getUserRole(user.uid);
        this.roleSubject.next(role);
      }

      this.userSubject.next(user);
      return user;
    } catch (error) {
      console.error("Erreur de connexion :", (error as Error).message);
      return null;
    }
  }

  async getUserRole(uid: string): Promise<string | null> {
    try {
      const userDoc = await getDoc(doc(this.firestore, `users/${uid}`));
      if (userDoc.exists()) {
        return userDoc.data()?.['role'] || 'user'; // 🔹 Correction de l'accès à `role`
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération du rôle :", error);
      return null;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.userSubject.next(null);
    this.roleSubject.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable(observer => {
      this.user$.subscribe(user => observer.next(!!user));
    });
  }

  isAdmin(): Observable<boolean> {
    return new Observable(observer => {
      this.role$.subscribe(role => observer.next(role === 'admin'));
    });
  }
  
}
