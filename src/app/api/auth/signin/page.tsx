'use client';

import { useEffect } from 'react';
import { SessionProvider, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn('keycloak');
    } else if (status === 'authenticated') {
      const callbackUrl = window.location.search.includes('callbackUrl=')
        ? decodeURIComponent(
            window.location.search.replace(/^\?callbackUrl=/, '')
          )
        : '/'; // better than nothing
      void router.push(callbackUrl);
    }
  }, [status, router]);

  return null;
};

const WrappedSignIn = () => (
  <SessionProvider>
    <SignIn />
  </SessionProvider>
);
export default WrappedSignIn;
