import { AppFactory } from "@/app.factory";
import type { TestModule } from "@/test.module";
import { Server as HttpServer } from "http";

let instance: { server: HttpServer; module: TestModule; port: number } | null = null;

export async function getTestContext() {
  if (instance) return instance;

  const { server, module } = AppFactory.create("test");
  const runningServer = server.start(0); // OS picks random port
  const address = runningServer.address();

  if (!address || typeof address === "string") {
    throw new Error("Failed to spin up test server");
  }

  instance = {
    server: runningServer,
    module: module as TestModule,
    port: address.port,
  };

  return instance;
}

export const request = async (path: string, options: RequestInit = {}) => {
  const { port } = await getTestContext();
  return fetch(`http://localhost:${port}${path}`, options);
};

export const signup = async () => {
  const { port } = await getTestContext();

  const payload = {
    email: "landlord1@gmail.com",
    phone: "01903709156",
    password: "qwerty",
    name: "landlord1",
  };

  const authResponse = await fetch(`http://localhost:${port}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const cookie = authResponse.headers.get("session");
  return cookie;
};
