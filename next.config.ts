import type { NextConfig } from 'next';
const config: NextConfig = {
  env: { NEXT_PUBLIC_APP_VERSION: process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA || String(Date.now()) },
};
export default config;
