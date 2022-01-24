import WebSocket, { WebSocketServer } from "ws";
import TurtleInitDTO from "./classes/DTO/TurtleInitDTO";
import TurtleResponseDTO from "./classes/DTO/TurtleResponseDTO";
import Turtle from "./classes/Turtle";
import Actions from "./classes/DTO/action";

const wss = new WebSocketServer({ port: 8080 });

console.log("Server started");

const turtles: Turtle[] = [];

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    let data: TurtleInitDTO | TurtleResponseDTO = JSON.parse(message);
    if (data.action === Actions.Init) {
      data = data as TurtleInitDTO;
      const turtle = new Turtle(
        data.x,
        data.y,
        data.z,
        data.facing,
        data.dimension,
        data.id,
        ws
      );
      turtles.push(turtle);
      console.log(`Turtle ${turtle.id} added`);
    }
  });
  ws.send("Hello World");
});
