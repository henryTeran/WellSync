import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, authState, signInAnonymously, EmailAuthProvider } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { linkWithCredential } from 'firebase/auth';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
 
  private roleSubject = new BehaviorSubject<string | null>(null); 

  user$: Observable<User | null> ;
  role$: Observable<string | null> = this.roleSubject.asObservable(); 

  constructor(private _firestore: Firestore) {
    this.user$ = authState(this.auth);
    this.auth.onAuthStateChanged(async (user) => {
      // this.userSubject.next(user);
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
        const userRef = doc(this._firestore, `users/${user.uid}`);
        await setDoc(userRef, { email: user.email, role });

        this.roleSubject.next(role);
      }

      // this.userSubject.next(user);
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

      //  this.userSubject.next(user);
      return user;
    } catch (error) {
      console.error("Erreur de connexion :", (error as Error).message);
      return null;
    }
  }

  async getUserRole(uid: string): Promise<string | null> {
    try {
      // const firestore = inject(Firestore);
      const userRef = doc(this._firestore, `users/${uid}`);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data()?.['role'] || 'user'; //  Correction de l'accès à `role`
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération du rôle :", error);
      return null;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    // this.userSubject.next(null);
    this.roleSubject.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    return authState(this.auth).pipe(
      map(user => !!user)
    )
  }

  isAdmin(): Observable<boolean> {
    return this.role$.pipe(
      map(role => role === 'admin')
    );
  }

  async loginAnonyme(): Promise<User | null> {
    try {
      const credential = await signInAnonymously(this.auth);
      const user = credential.user;
  
      if (user) {
       
        const userRef = doc(this._firestore, `users/${user.uid}`);
        await setDoc(userRef, { uid: user.uid, role: 'user', anonymous: true }, { merge: true });
        this.roleSubject.next('user');
      }
      console.log("userAnonyme", user )
      return user;
    } catch (error) {
      console.error("Erreur de connexion anonyme :", error);
      return null;
    }
  }

  async convertirEnCompte(email: string, password: string, role: string): Promise<User | null> {
    const user = this.auth.currentUser;
  
    if (!user) {
      throw new Error("Aucun utilisateur connecté");
    }
  
    const credential = EmailAuthProvider.credential(email, password);
  
    try {
      const result = await linkWithCredential(user, credential);
  
      // Met à jour le document Firestore existant (même UID !)
      const userRef = doc(this._firestore, `users/${user.uid}`);
      await setDoc(userRef, { 
        email: result.user.email,
        role, 
        anonymous: false,
        updatedAt: new Date() 
      }, { merge: true });
      
      this.roleSubject.next(role);
      return result.user;
    } catch (error) {
      console.error("Erreur de conversion en compte : ", error);
      return null;
    }
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }
  
}
