// tests/setup.ts
import { beforeAll } from "bun:test";

process.env.NODE_ENV = "test";
process.env.CLIENT_URL = "http://localhost:3000";
process.env.SECRET_KEY = "test-secret-key-123";
process.env.DATABASE_URL = "postgresql://postgres:password@localhost:5432/erent_test_db";
process.env.JWT_TOKEN = "test-jwt-token-fixed-for-testing";

// Cloudinary / Media storage mocks
process.env.CLOUD_NAME = "mock-cloud";
process.env.CLOUD_API_KEY = "mock-key";
process.env.CLOUD_API_SECRET = "mock-secret";

// You can also add global setup logic here if needed
beforeAll(() => {
  console.log("🚀 Global test environment initialized");
});
