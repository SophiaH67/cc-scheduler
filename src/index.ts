import { WebSocketServer } from "ws";
import TurtleScheduler from "./classes/TurtleScheduler";

const wss = new WebSocketServer({ port: 8080 });

new TurtleScheduler(wss);

console.log("Server started");
