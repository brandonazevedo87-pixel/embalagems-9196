import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { runableManagedAuth } from '@runablehq/managed-auth/server';
import { db } from './database';
import * as schema from './database/schema';

const siteOrigin = new URL(process.env.WEBSITE_URL!).origin;

export const auth = betterAuth({
  basePath: '/api/auth',
  baseURL: siteOrigin,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [siteOrigin, ...(process.env.BISPO_AUTH_PREVIEW_ORIGIN ? [process.env.BISPO_AUTH_PREVIEW_ORIGIN] : []), ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:4200', 'http://127.0.0.1:4200'] : [])],
  database: drizzleAdapter(db, { provider: 'sqlite', schema }),
  emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 12 },
  user: { additionalFields: { role: { type: 'string', defaultValue: 'user', input: false } } },
  plugins: [...runableManagedAuth({ applicationId: process.env.APPLICATION_ID!, issuer: process.env.VITE_RUNABLE_AUTH_ISSUER! })],
});
