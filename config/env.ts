import { z } from "zod";

/**
 * Environment variable schema and typed accessor.
 *
 * Expo inlines any variable prefixed with EXPO_PUBLIC_ into the client
 * bundle at build time (via `process.env.EXPO_PUBLIC_*`). Never put
 * secret/server-only keys behind this prefix.
 *
 * Copy `.env.example` to `.env` and fill in real values before running
 * the app locally.
 */

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url({
    message: "EXPO_PUBLIC_SUPABASE_URL must be a valid URL",
  }),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, {
    message: "EXPO_PUBLIC_SUPABASE_ANON_KEY is required",
  }),
});

type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse({
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Invalid environment configuration. Check your .env file:\n${issues}`,
    );
  }

  return parsed.data;
}

export const env = loadEnv();
