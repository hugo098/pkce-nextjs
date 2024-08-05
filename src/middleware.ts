import { withAuth } from 'next-auth/middleware';
import { chain } from './middlewares/chain';
import { withUpdateCookieMiddleware } from './middlewares/with-update-cookie-middleware';

export default withAuth({
  pages: {
    signIn: '/api/auth/signin/',
  },
});

export const config = {
  matcher: ['/((?!abc|api|_next/static|images|favicon.ico|api/auth/).*)'],
};

//export default chain([withUpdateCookieMiddleware]);
