import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth({
  loginPage: "/api/auth/login",
  isReturnToCurrentPage: true,
});

export const config = {
  // only protect the dashboard routes
  matcher: ["/dashboard/:path*"],
};
