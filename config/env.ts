import { z } from "zod";

/**
 * Environment variable schema and typed accessor.
 *
 * Expo inlines any variable prefixed with EXPO_PUBLIC_ into the client
 * bundle at build time (via `process.env.EXPO_PUBLIC_*`). Never put
 * secret/server-only keys behind this prefix.
 *
 * Provides safe fallback defaults for local demo / offline preview mode
 * so that missing environment variables never cause white screen crashes.
 */

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z
    .string()
    .url({
      message: "EXPO_PUBLIC_SUPABASE_URL must be a valid URL",
    })
    .default("https://demo-project.supabase.co"),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, {
      message: "EXPO_PUBLIC_SUPABASE_ANON_KEY is required",
    })
    .default("demo-anon-key-placeholder"),
});

type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  const parsed = envSchema.safeParse({
    EXPO_PUBLIC_SUPABASE_URL: rawUrl && rawUrl.trim() !== "" ? rawUrl : "https://demo-project.supabase.co",
    EXPO_PUBLIC_SUPABASE_ANON_KEY: rawKey && rawKey.trim() !== "" ? rawKey : "demo-anon-key-placeholder",
  });

  if (!parsed.success) {
    return {
      EXPO_PUBLIC_SUPABASE_URL: "https://demo-project.supabase.co",
      EXPO_PUBLIC_SUPABASE_ANON_KEY: "demo-anon-key-placeholder",
    };
  }

  return parsed.data;
}

export const env = loadEnv();
