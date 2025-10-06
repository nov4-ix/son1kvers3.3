/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_INSTAGRAM_CLIENT_ID: string
  readonly VITE_INSTAGRAM_REDIRECT_URI: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_STRIPE_SECRET_KEY: string
  readonly VITE_STRIPE_WEBHOOK_SECRET: string
  readonly VITE_SCHEDULER_INTERVAL_MS: string
  readonly VITE_SCHEDULER_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
