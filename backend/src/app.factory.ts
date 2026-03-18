// src/factories/app.factory.ts
import express from "express";
import { Server } from "@/server";
import { MainModule } from "@/main.module";
import { TestModule } from "@/test.module";

export class AppFactory {
  public static create(env: "prod" | "test" = "prod") {
    const app = express();

    // Choose the "Brain" based on the environment
    const module = env === "test" ? new TestModule() : new MainModule();

    console.log("$$$$$$$$ ", module);

    // Create the server instance
    const server = new Server(app, module);

    return {
      server,
      app,
      // module: module as any, // Cast so we can access fakes in tests
      module: module, // Cast so we can access fakes in tests
    };
  }
}
