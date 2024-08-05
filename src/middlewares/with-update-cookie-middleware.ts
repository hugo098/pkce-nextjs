import { encode, getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CustomMiddleware } from './chain';

const sessionCookie = process.env.NEXTAUTH_URL?.startsWith('https://')
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token';

function signout(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL('/api/auth/signin', request.url)
  );

  request.cookies.getAll().forEach((cookie) => {
    if (cookie.name.includes('next-auth')) response.cookies.delete(cookie.name);
  });

  return response;
}

function shouldUpdateToken(expires_at: number) {
  // Check the token expiration date or whatever logic you need

  if (Date.now() >= expires_at * 1000) {
    return true;
  }
}

export function withUpdateCookieMiddleware(
  middleware: CustomMiddleware
): CustomMiddleware {
  return async (request: NextRequest) => {
    console.log('Executed middleware');

    const session = await getToken({ req: request });

    if (!session) return signout(request);

    const response = NextResponse.next();

    if (shouldUpdateToken(session?.expires_at as number)) {
      // Here yoy retrieve the new access token from your custom backend
      const newAccessToken = await refreshAccessToken(session);

      const newSessionToken = await encode({
        secret: process.env.NEXTAUTH_SECRET!,
        token: {
          ...session,
          accessToken: newAccessToken,
        },
        maxAge: 30 * 24 * 60 * 60, // 30 days, or get the previous token's exp
      });

      // Update session token with new access token
      response.cookies.set(sessionCookie, newSessionToken);
    }

    return response;
  };
}

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(
      'http://localhost:8080/realms/homebanking/protocol/openid-connect/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: 'app-pkce',
          refresh_token: token.refresh_token as string,
        }).toString(),
      }
    );

    //console.log(response);
    const newTokens = await response.json();
    console.log(newTokens);

    if (response.ok) {
      const futureDate = new Date(
        new Date().getTime() + newTokens.expires_in * 1000
      );
      // Convert the future date to Unix epoch timestamp (in seconds)
      const tokenExpiresIn = Math.floor(futureDate.getTime() / 1000);
      console.log(tokenExpiresIn);

      return {
        ...token,
        access_token: newTokens.access_token,
        expires_at: tokenExpiresIn,
        // Fall back to old refresh token, but note that
        // many providers may only allow using a refresh token once.
        refresh_token: newTokens.refresh_token, //?? token.refresh_token,
      };
    }
  } catch (err: any) {
    console.error(err?.message);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
