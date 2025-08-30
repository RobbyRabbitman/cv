import { Injectable, signal } from '@angular/core';
import type { AuthApi } from '@robby-rabbitman/cv-libs-auth-data';
import type { User } from 'firebase/auth';

const USERS = {
  chickenPanda: {
    uid: 'S0t0Kro6imiEOuqsBkcygdjNlaXf',
    email: 'chicken.panda.26@example.com',
    emailVerified: true,
    displayName: 'Chicken Panda',
    isAnonymous: false,
  },
} as const satisfies Record<string, Partial<User>>;

@Injectable()
export class AuthApiStub implements Partial<AuthApi> {
  readonly user = signal<User | null | undefined>(undefined);

  constructor() {
    this.simulateAuthInitialization();
  }

  async signOut() {
    this.user.set(null);
  }

  async signIn() {
    this.user.set(USERS.chickenPanda as User);
  }

  protected async simulateAuthInitialization() {
    this.user.set(null);
  }
}
