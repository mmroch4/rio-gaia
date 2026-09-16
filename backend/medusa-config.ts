import { defineConfig, loadEnv, Modules } from "@medusajs/framework/utils";
import { COMPANY_MODULE } from "./src/modules/company";
import { MEILISEARCH_MODULE } from "./src/modules/meilisearch";
import { QUOTE_MODULE } from "./src/modules/quote";

loadEnv(process.env.NODE_ENV!, process.cwd());

const REDIS_URL = process.env.REDIS_URL;
const S3_BUCKET = process.env.S3_BUCKET;

// Build modules conditionally — Redis-backed in production, in-memory for development
const modules: Record<string, any> = {
  [COMPANY_MODULE]: {
    resolve: "./modules/company",
  },
  [QUOTE_MODULE]: {
    resolve: "./modules/quote",
  },
  [Modules.NOTIFICATION]: {
    resolve: "@medusajs/medusa/notification",
    options: {
      providers: [
        {
          resolve: "./src/modules/email-notification",
          id: "email-notification",
          options: {
            channels: ["email"],
            smtp_host: process.env.SMTP_HOST,
            smtp_port: parseInt(process.env.SMTP_PORT || "2525"),
            smtp_user: process.env.SMTP_USER,
            smtp_pass: process.env.SMTP_PASS,
            smtp_from: process.env.SMTP_FROM,
          },
        },
      ],
    },
  },
  [MEILISEARCH_MODULE]: {
    resolve: "./modules/meilisearch",
    options: {
      host: process.env.MEILISEARCH_HOST || "http://127.0.0.1:7700",
      apiKey: process.env.MEILISEARCH_API_KEY || "masterKey123",
      productIndexName:
        process.env.MEILISEARCH_PRODUCT_INDEX_NAME || "products",
    },
  },
};

if (REDIS_URL) {
  // Production: Redis-backed infrastructure modules
  modules[Modules.CACHE] = {
    resolve: "@medusajs/medusa/caching",
    options: {
      providers: [
        {
          resolve: "@medusajs/caching-redis",
          id: "caching-redis",
          is_default: true,
          options: { redisUrl: REDIS_URL },
        },
      ],
    },
  };
  modules[Modules.WORKFLOW_ENGINE] = {
    resolve: "@medusajs/medusa/workflow-engine-redis",
    options: { redis: { url: REDIS_URL } },
  };
  modules[Modules.EVENT_BUS] = {
    resolve: "@medusajs/medusa/event-bus-redis",
    options: { redisUrl: REDIS_URL },
  };
  modules[Modules.LOCKING] = {
    resolve: "@medusajs/medusa/locking",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/locking-redis",
          id: "locking-redis",
          is_default: true,
          options: { redisUrl: REDIS_URL },
        },
      ],
    },
  };
} else {
  // Development: in-memory modules (no Redis required)
  // Caching Module defaults to in-memory when no providers are configured
  modules[Modules.WORKFLOW_ENGINE] = {
    resolve: "@medusajs/medusa/workflow-engine-inmemory",
  };
}

if (S3_BUCKET) {
  modules[Modules.FILE] = {
    resolve: "@medusajs/medusa/file",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/file-s3",
          id: "s3",
          options: {
            file_url: process.env.S3_FILE_URL,
            access_key_id: process.env.S3_ACCESS_KEY_ID,
            secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
            region: process.env.S3_REGION,
            bucket: S3_BUCKET,
            endpoint: process.env.S3_ENDPOINT,
            prefix: process.env.S3_PREFIX,
          },
        },
      ],
    },
  };
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: REDIS_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as
      | "shared"
      | "worker"
      | "server"
      | undefined,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret:
        process.env.JWT_SECRET ??
        (() => {
          throw new Error("JWT_SECRET env var is required");
        })(),
      cookieSecret:
        process.env.COOKIE_SECRET ??
        (() => {
          throw new Error("COOKIE_SECRET env var is required");
        })(),
    },
  },
  modules,
  plugins: [
    {
      resolve: "@agilo/medusa-analytics-plugin",
      options: {
        stock_threshold: 10,
      },
    },
  ],
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.BACKEND_URL || "http://localhost:9000",
    storefrontUrl: process.env.STOREFRONT_URL || "http://localhost:8000",
    path: "/app",
  },
});
