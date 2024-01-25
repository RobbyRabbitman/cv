import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { firebaseAuth } from '@cv/common/util';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';

@Injectable()
export class Auth {
  protected auth = firebaseAuth();
  protected destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(onAuthStateChanged(this.auth, this.user.set));
  }

  /** The user if logged in, else null. */
  user = signal(this.auth.currentUser);

  /** Signs out the current user. */
  async signOut() {
    await this.auth.signOut();
  }

  /** Sign in the user with google. */
  async signIn() {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }
}
