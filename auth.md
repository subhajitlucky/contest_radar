# Authentication Roadmap for Contest Radar

## Overview
This roadmap provides a comprehensive, step-by-step guide to implementing authentication in the Contest Radar application using NextAuth.js, Prisma, and a database (PostgreSQL based on the roadmap). The goal is to enable user registration, login, session management, and secure access to protected features like the dashboard and leaderboard.

We will proceed slowly, breaking down each phase into detailed steps to ensure full understanding. Total estimated steps: ~120 (broken into phases for clarity).

**Current State (from project scan):**
- Next.js 15.5.6 project with TypeScript
- Dependencies installed: next-auth, @auth/prisma-adapter, prisma, @prisma/client, bcryptjs
- Tailwind CSS for styling
- Basic UI structure with Navbar, Footer, and pages (home, contests, dashboard, leaderboard)
- No authentication implemented yet
- No Prisma schema or database connection
- Roadmap indicates PostgreSQL as database choice

**Assumptions:**
- Using PostgreSQL as per roadmap
- Supporting multiple auth providers: Credentials (email/password), Google, GitHub
- Protecting dashboard and leaderboard pages
- Integrating with existing user dashboard

## Prerequisites
1. Ensure all dependencies are installed (already done via npm install).
2. Set up environment variables file (.env.local) for secrets.
3. Have a PostgreSQL database ready (local or cloud like Supabase/Neon).
4. Basic understanding of Next.js, React, and TypeScript.

## Phase 1: Database Setup with Prisma (20 steps)
Focus on setting up the database schema for users, accounts, and sessions.

1. Initialize Prisma in the project if not done: Run `npx prisma init`.
2. Configure Prisma to use PostgreSQL: Update `prisma/schema.prisma` with PostgreSQL provider.
3. Define the User model: Include fields like id, email, name, password (for credentials), emailVerified, image, createdAt, updatedAt.
4. Define the Account model: For linking users to OAuth providers (provider, providerAccountId, etc.).
5. Define the Session model: For managing user sessions (sessionToken, userId, expires).
6. Define the VerificationToken model: For email verification tokens.
7. Add relations between models (User has many Accounts, Sessions).
8. Configure Prisma Client generation in schema.prisma.
9. Run `npx prisma generate` to generate the Prisma client.
10. Create a lib/prisma.ts file to export the Prisma client instance.
11. Set up database connection string in .env.local (DATABASE_URL).
12. Test database connection by running a simple query in a test script.
13. Push schema to database: `npx prisma db push`.
14. Create seed data for testing (optional: add a test user).
15. Verify models in Prisma Studio: `npx prisma studio`.
16. Add TypeScript types for the models.
17. Configure bcryptjs for password hashing in a utils file.
18. Add validation for user input (email format, password strength).
19. Set up database indexes for performance (e.g., on email).
20. Document the schema changes in a comment or separate file.

## Phase 2: NextAuth Configuration (25 steps)
Set up the core authentication logic.

21. Create `src/lib/auth.ts` for NextAuth configuration.
22. Import necessary modules: NextAuth, PrismaAdapter, providers.
23. Configure the PrismaAdapter with the Prisma client.
24. Set up CredentialsProvider for email/password login.
25. Implement password verification using bcryptjs in CredentialsProvider.
26. Add GoogleProvider for OAuth login.
27. Add GitHubProvider for OAuth login.
28. Configure provider client IDs and secrets in .env.local.
29. Set up session strategy (database or JWT; recommend database for persistence).
30. Configure callbacks: jwt, session to include user data.
31. Add signIn callback for custom logic (e.g., email verification check).
32. Set up pages: signIn, signUp, error pages.
33. Configure theme and branding for auth pages.
34. Add secret key for JWT in .env.local (NEXTAUTH_SECRET).
35. Set up URL for NextAuth (NEXTAUTH_URL).
36. Test configuration by importing and checking for errors.
37. Add TypeScript types for NextAuth session and user.
38. Configure email verification for new users.
39. Set up password reset functionality (token generation).
40. Add rate limiting for auth attempts.
41. Configure logout behavior.
42. Add custom error handling.
43. Set up redirect URLs after login/logout.
44. Document the auth configuration options.
45. Test auth config in isolation (without UI).

## Phase 3: API Routes Setup (15 steps)
Create the necessary API endpoints.

46. Create `src/app/api/auth/[...nextauth]/route.ts` for NextAuth handler.
47. Export GET and POST handlers from the route.
48. Test the auth API endpoint manually (e.g., via curl or Postman).
49. Create `src/app/api/auth/signup/route.ts` for user registration.
50. Implement signup logic: validate input, hash password, create user in DB.
51. Add email verification sending (placeholder for now).
52. Create `src/app/api/auth/verify-email/route.ts` for email verification.
53. Implement token validation and user activation.
54. Create `src/app/api/auth/forgot-password/route.ts` for password reset request.
55. Implement token generation and email sending.
56. Create `src/app/api/auth/reset-password/route.ts` for password reset.
57. Implement password update with token validation.
58. Add input validation and error handling for all routes.
59. Set up CORS if needed for external requests.
60. Test all API routes with sample data.

## Phase 4: UI Components for Authentication (20 steps)
Build the frontend components.

61. Create `src/components/Auth/SignInForm.tsx` component.
62. Add form fields: email, password, remember me checkbox.
63. Implement form submission with NextAuth signIn.
64. Add loading states and error messages.
65. Create `src/components/Auth/SignUpForm.tsx` component.
66. Add form fields: name, email, password, confirm password.
67. Implement form submission to signup API.
68. Add validation (client-side) for all fields.
69. Create `src/components/Auth/ForgotPasswordForm.tsx`.
70. Implement email submission for password reset.
71. Create `src/components/Auth/ResetPasswordForm.tsx`.
72. Add new password fields and token handling.
73. Create `src/components/Auth/UserMenu.tsx` for logged-in users.
74. Add logout functionality.
75. Create `src/components/Auth/AuthModal.tsx` for modal-based auth.
76. Integrate forms with Tailwind CSS for styling.
77. Add accessibility features (ARIA labels, keyboard navigation).
78. Create `src/components/Auth/ProtectedRoute.tsx` wrapper.
79. Implement conditional rendering based on session.
80. Add social login buttons (Google, GitHub).

## Phase 5: Protecting Routes and Middleware (15 steps)
Secure the application.

81. Create `src/middleware.ts` for route protection.
82. Configure matcher for protected routes (e.g., /dashboard, /leaderboard).
83. Implement session checking in middleware.
84. Add redirect to sign-in for unauthenticated users.
85. Configure public routes that don't require auth.
86. Update `src/app/dashboard/page.tsx` to use session data.
87. Add user-specific data fetching in dashboard.
88. Update `src/app/leaderboard/page.tsx` for auth integration.
89. Create `src/app/profile/page.tsx` for user profile management.
90. Implement profile update functionality.
91. Add role-based access if needed (e.g., admin features).
92. Test middleware by accessing protected routes.
93. Handle edge cases (expired sessions, invalid tokens).
94. Add loading states for session checks.
95. Document protected routes and access rules.

## Phase 6: Integration with Existing Features (10 steps)
Connect auth to the app's core features.

96. Update Navbar to show user menu or sign-in button.
97. Integrate user data into dashboard placeholders.
98. Add user registration for contests (link to auth).
99. Update leaderboard to show user's position.
100. Add user preferences (e.g., notification settings).
101. Implement contest participation tracking per user.
102. Add user analytics in dashboard.
103. Connect auth to notifications system (future).
104. Update Footer with auth-related links.
105. Test full user flow: sign up -> verify -> login -> dashboard.

## Phase 7: Advanced Authentication Features (10 steps)
Enhance the auth system.

106. Implement email verification with nodemailer (integrate later).
107. Add two-factor authentication (2FA).
108. Set up social login with additional providers (e.g., Discord).
109. Add account linking (connect multiple providers).
110. Implement session management (view active sessions).
111. Add password strength indicator.
112. Set up user deletion and data export.
113. Add audit logs for auth events.
114. Implement rate limiting per user.
115. Add CAPTCHA for sign-up to prevent bots.

## Phase 8: Testing Authentication (10 steps)
Ensure reliability.

116. Write unit tests for auth utilities (password hashing).
117. Test API routes with Jest/Supertest.
118. Add integration tests for sign-in/sign-up flow.
119. Test protected routes with authenticated/unauthenticated users.
120. Add E2E tests with Playwright for full user journeys.
121. Test OAuth flows (Google, GitHub).
122. Verify session persistence across page reloads.
123. Test error scenarios (invalid credentials, expired tokens).
124. Add performance tests for auth endpoints.
125. Document test cases and expected behaviors.

## Phase 9: Security and Best Practices (10 steps)
Harden the system.

126. Use HTTPS in production.
127. Store secrets securely (never in code).
128. Implement CSRF protection.
129. Add input sanitization and validation.
130. Set up proper CORS policies.
131. Monitor for security vulnerabilities (audit dependencies).
132. Implement logging for auth events.
133. Add rate limiting and DDoS protection.
134. Use secure cookies for sessions.
135. Regularly update dependencies and rotate secrets.

## Phase 10: Deployment and Monitoring (5 steps)
Prepare for production.

136. Set up environment variables on deployment platform (Vercel).
137. Configure database for production.
138. Test auth in staging environment.
139. Set up monitoring (error tracking, analytics).
140. Document deployment steps and rollback procedures.

## Conclusion
This roadmap provides a thorough guide to implementing authentication. Start with Phase 1 and proceed step-by-step. Each phase builds on the previous one. If you encounter issues, refer back to the steps or ask for clarification. Remember, we can adjust based on your progress and feedback.