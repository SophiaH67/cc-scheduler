import WebSocket, { WebSocketServer } from "ws";
import Turtle from "./classes/Turtle";

const wss = new WebSocketServer({ port: 8080 });

console.log("Server started");

const turtles: Turtle[] = [];

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    const data = JSON.parse(message);
    const turtle = turtles.find((t) => t.id === data.id);
    if (turtle) {
      turtle.ws = ws;
    } else {
      turtles.push(
        new Turtle(
          data.x,
          data.y,
          data.z,
          data.facing,
          data.dimensions,
          data.id,
          ws
        )
      );
    }
  });
  ws.send("Hello World");
});
