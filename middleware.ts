import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Customize your authorization logic here
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    '/api/google/:path*',
    // Add other protected routes here
  ],
};