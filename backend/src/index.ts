import { AppFactory } from "@/app.factory";

const { server } = AppFactory.create("prod");

server.start(4001);
