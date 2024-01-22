import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth as FirebaseAuth,
  GoogleAuthProvider,
  authState,
  getRedirectResult,
  signInWithRedirect,
} from '@angular/fire/auth';

@Injectable()
export class Auth {
  protected auth = inject(FirebaseAuth);

  /** The user if logged in, else null. */
  user = toSignal(authState(this.auth), {
    initialValue: this.auth.currentUser,
  });

  /** Signs out the current user. */
  async signOut() {
    await this.auth.signOut();
  }

  /** Sign in the user with google. */
  async signIn() {
    await signInWithRedirect(this.auth, new GoogleAuthProvider());
    await getRedirectResult(this.auth);
  }
}
