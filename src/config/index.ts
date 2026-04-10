import { z } from 'zod';

const envSchema = z.object({
  // Check that it's a valid string (URLs can be tricky with Zod's .url() if they don't have http)
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  PORT: z.coerce.number().default(3000),
  
  // Tokens
  REFRESH_TOKEN_TTL: z.coerce.number().default(30 * 24 * 60 * 60), 
  ACCESS_TOKEN_TTL: z.coerce.number().default(15 * 60),
  
  // Auth
  SALT_ROUNDS: z.coerce.number().default(10),
  ACCESS_JWT_SECRET: z.string().min(32, "ACCESS_JWT_SECRET should be at least 32 characters"),
  REFRESH_JWT_SECRET: z.string().min(32, "REFRESH_JWT_SECRET should be at least 32 characters"),
  
  CLIENT_BASE_URL: z.string().url().default('http://localhost:5173')
});

// Validate process.env (which Node already filled using --env-file)
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:');
  parsedEnv.error.issues.forEach((issue) => {
    console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
  });
  process.exit(1);
}

export const {
  ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET,
  ACCESS_TOKEN_TTL,
  CLIENT_BASE_URL,
  MONGO_URI,
  REFRESH_TOKEN_TTL,
  SALT_ROUNDS,
  PORT
} = parsedEnv.data;