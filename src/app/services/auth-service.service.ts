import { inject, Injectable } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  User,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  private _user = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this._user.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this._user.next(user);
    });
  }

  signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  get currentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }
}
