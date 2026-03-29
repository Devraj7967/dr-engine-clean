import { withAuth } from "next-auth/middleware";

export default withAuth({
  secret:
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV !== "production" ? "autodiag-dev-secret-change-me" : undefined),
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/", "/diagnose", "/emergency", "/garages", "/problems/:path*", "/profile", "/report"],
};
