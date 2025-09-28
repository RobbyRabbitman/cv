import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FIREBASE_AUTH } from '@robby-rabbitman/cv-libs-common-util';
import {
  GoogleAuthProvider,
  type User,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { first, firstValueFrom } from 'rxjs';

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

  /** Whether the auth state has been resolved. */
  readonly resolved = computed(() => this.user() !== undefined);

  /** A promise that resolves once the auth state has been resolved. */
  readonly waitForResolved = firstValueFrom(
    toObservable(this.resolved).pipe(first(Boolean)),
  );

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
    try {
      await signInWithPopup(this.auth, new GoogleAuthProvider());
      return true;
    } catch {
      return false;
    }
  }
}
