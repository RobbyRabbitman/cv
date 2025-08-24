import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { FIREBASE_AUTH } from '@robby-rabbitman/cv-libs-common-util';
import {
  GoogleAuthProvider,
  type User,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';

@Injectable()
export class AuthApi {
  protected readonly auth = inject(FIREBASE_AUTH);

  /**
   * The user if logged in, else null. Undefined while the auth process has not
   * been resovled yet.
   */
  readonly user = (() => {
    const user = signal<User | null | undefined>(undefined);

    inject(DestroyRef).onDestroy(onAuthStateChanged(this.auth, user.set));

    return user.asReadonly();
  })();

  /** Signs out the current user. */
  async signOut() {
    await this.auth.signOut();
  }

  /**
   * Sign in the user with google.
   *
   * TODO: make provider injectable.
   */
  async signIn() {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }
}
