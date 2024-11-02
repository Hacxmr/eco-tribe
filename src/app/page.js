'use client';

import { SignInButton, SignUpButton, UserProfileButton } from './components/Auth';
import { auth } from '@clerk/nextjs';

export default async function Home() {
  const { userId } = auth();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {userId ? (
          <>
            <h1>Welcome to EcoVibe Tribe!</h1>
            <UserProfileButton />
          </>
        ) : (
          <div className="flex gap-4">
            <SignInButton />
            <SignUpButton />
          </div>
        )}
      </div>
    </main>
  );
}