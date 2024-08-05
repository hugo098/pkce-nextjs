import { jwtDecode } from 'jwt-decode';
import NextAuth, { NextAuthOptions, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: 'app-pkce',
      clientSecret: '',
      issuer: 'http://localhost:8080/realms/homebanking',
      authorization: {
        params: {
          scope: 'openid profile email', // Define the scopes you need
          code_challenge_method: 'S256', // Optional: specifies the PKCE code challenge method
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, profile }) {
      console.log(`In JWT callback - Token is ${JSON.stringify(token)}`);
      console.log(`In JWT callback - Account is ${JSON.stringify(account)}`);
      console.log(`In JWT callback - User is ${JSON.stringify(user)}`);

      if (account && user) {
        console.log(
          `In JWT callback - First login account is ${JSON.stringify(account)}`
        );
        console.log(
          `In JWT callback - First login account is ${JSON.stringify(user)}`
        );
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          user: user,
        } as JWT;
      }

      /*console.log(
        '*** Access token expires at ***',
        token.expires_at,
        new Date(token.expires_at * 1000)
      );

      if (Date.now() < token.expires_at * 1000) {
        // Subsequent logins, if the `access_token` is still valid, return the JWT
        console.log('Access token still valid');

        return token;
      }*/
      return token;

      //return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      console.log(`In session callback - Token is ${JSON.stringify(token)}`);

      if (token) {
        session.accessToken = token.access_token;
        session.refreshToken = token.refresh_token;
        session.accessTokenExpiresIn = token.expires_at;
      }

      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
