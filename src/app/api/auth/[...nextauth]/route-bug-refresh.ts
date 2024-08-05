// import { jwtDecode } from 'jwt-decode';
// import NextAuth, { NextAuthOptions, User } from 'next-auth';
// import { JWT } from 'next-auth/jwt';
// import KeycloakProvider from 'next-auth/providers/keycloak';

// async function refreshAccessToken(token: any) {
//   try {
//     const response = await fetch(
//       'http://localhost:8080/realms/homebanking/protocol/openid-connect/token',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//           grant_type: 'refresh_token',
//           client_id: 'app-pkce',
//           refresh_token: token.refresh_token as string,
//         }).toString(),
//       }
//     );

//     console.log(response);
//     const newTokens = await response.json();
//     console.log(newTokens);

//     if (response.ok) {
//       const futureDate = new Date(
//         new Date().getTime() + newTokens.expires_in * 1000
//       );
//       // Convert the future date to Unix epoch timestamp (in seconds)
//       const tokenExpiresIn = Math.floor(futureDate.getTime() / 1000);
//       console.log(tokenExpiresIn);

//       return {
//         ...token,
//         access_token: newTokens.access_token,
//         expires_at: tokenExpiresIn,
//         // Fall back to old refresh token, but note that
//         // many providers may only allow using a refresh token once.
//         refresh_token: newTokens.refresh_token, //?? token.refresh_token,
//       };
//     }
//   } catch (err: any) {
//     console.error(err?.message);
//     return {
//       ...token,
//       error: 'RefreshAccessTokenError',
//     };
//   }
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     KeycloakProvider({
//       clientId: 'app-pkce',
//       clientSecret: '',
//       issuer: 'http://localhost:8080/realms/homebanking',
//       authorization: {
//         params: {
//           scope: 'openid profile email', // Define the scopes you need
//           code_challenge_method: 'S256', // Optional: specifies the PKCE code challenge method
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account, user, profile }) {
//       console.log(`In JWT callback - Token is ${JSON.stringify(token)}`);
//       console.log(`In JWT callback - Account is ${JSON.stringify(account)}`);
//       console.log(`In JWT callback - User is ${JSON.stringify(user)}`);

//       if (account && user) {
//         console.log(
//           `In JWT callback - First login account is ${JSON.stringify(account)}`
//         );
//         console.log(
//           `In JWT callback - First login account is ${JSON.stringify(user)}`
//         );
//         return {
//           ...token,
//           access_token: account.access_token,
//           expires_at: account.expires_at,
//           refresh_token: account.refresh_token,
//           user: user,
//         } as JWT;
//       }

//       console.log(
//         '*** Access token expires at ***',
//         token.expires_at,
//         new Date(token.expires_at * 1000)
//       );

//       if (Date.now() < token.expires_at * 1000) {
//         // Subsequent logins, if the `access_token` is still valid, return the JWT
//         console.log('Access token still valid');

//         return token;
//       }

//       return await refreshAccessToken(token);
//     },
//     async session({ session, token }) {
//       console.log(`In session callback - Token is ${JSON.stringify(token)}`);

//       if (token) {
//         session.accessToken = token.access_token;
//         session.refreshToken = token.refresh_token;
//         session.accessTokenExpiresIn = token.expires_at;
//       }

//       return session;
//     },
//   },
//   session: {
//     strategy: 'jwt',
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
