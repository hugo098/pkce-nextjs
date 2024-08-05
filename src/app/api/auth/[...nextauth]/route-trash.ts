// import { jwtDecode } from 'jwt-decode';
// import NextAuth, { NextAuthOptions } from 'next-auth';
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
//           refresh_token: token.refreshToken as string,
//         }).toString(),
//       }
//     );

//     console.log(response);
//     const newTokens = await response.json();
//     console.log(newTokens);

//     if (response.ok) {
//       return {
//         ...token,
//         accessToken: newTokens.access_token,
//         refreshToken: newTokens.refresh_token,
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
//     async jwt({ token, account, user }) {
//       console.log(`In jwt callback - Token is ${JSON.stringify(token)}`);

//       console.log(account?.access_token == token?.accessToken);
//       console.log(account?.access_token);
//       console.log(token?.accessToken);

//       if (account?.access_token || token?.accessToken) {
//         const decodedToken = jwtDecode(
//           (account?.access_token as string) || (token.accessToken as string)
//         );
//         console.log(decodedToken);

//         token.accessTokenExpiresAt = decodedToken.exp! * 1000;
//       }

//       if (account && user) {
//         console.log(`In jwt callback - User is ${JSON.stringify(user)}`);
//         console.log(`In jwt callback - Account is ${JSON.stringify(account)}`);

//         token.accessToken = account.access_token;
//         token.refreshToken = account.refresh_token;
//       }

//       console.log(
//         '*** Access token expires on ***',
//         token.accessTokenExpiresAt,
//         new Date(token.accessTokenExpiresAt as number)
//       );

//       if (Date.now() < (token.accessTokenExpiresAt as number)) {
//         console.log('*** returning previous token ***');

//         return token;
//       }

//       console.log('*** update token ***');

//       return await refreshAccessToken(token);
//     },
//     async session({ session, token }) {
//       console.log(`In session callback - Token is ${JSON.stringify(token)}`);
//       if (token) {
//         session.accessToken = token.accessToken as string;
//         session.refreshToken = token.refreshToken as string;
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
