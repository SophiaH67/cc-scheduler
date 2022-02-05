import TurtleInitDTO from "./DTO/TurtleInitDTO";
import TurtleResponseDTO from "./DTO/TurtleResponseDTO";
import Turtle from "./Turtle";
import Actions from "./DTO/action";
import WebSocket, { WebSocketServer } from "ws";
import PathfindJob from "./jobs/PathfindJob";
import TurtleUpdateDTO from "./DTO/TurtleUpdateDTO";

export default class TurtleScheduler {
  private turtles: Turtle[] = [];

  constructor(wss: WebSocketServer) {
    wss.on("connection", (ws: WebSocket) => {
      ws.on("message", (message: string) => {
        this.handleMessage(message, ws);
      });
    });
  }
  handleMessage(message: string, ws: WebSocket) {
    const data: TurtleResponseDTO | TurtleInitDTO | TurtleUpdateDTO =
      JSON.parse(message);
    switch (data.action) {
      // Actions.Init is used for both initializing a new turtle and updating an existing turtle.
      case Actions.Init:
        console.log("🌐", data.id, "sent us an init message");
        const turtle = new Turtle(
          data.x,
          data.y,
          data.z,
          data.facing,
          data.dimension,
          data.id,
          ws
        );
        if (this.getTurtleById(data.id)) {
          this.removeTurtleById(data.id);
        }
        this.addOrUpdateTurtle(turtle);
        /* TODO: Implement a scheduler */
        const job = new PathfindJob(turtle, { x: 6, y: 77, z: 46 });
        /* End of pathfind job */
        break;
      case Actions.Update:
        this.addOrUpdateTurtle(
          new Turtle(
            data.x,
            data.y,
            data.z,
            data.facing,
            data.dimension,
            data.id,
            ws
          )
        );
        break;
      case Actions.Response:
        const turtleResponseDTO: TurtleResponseDTO = data;
        // idk why but naming this `turtle` causes a TS error
        const turtlee = this.getTurtleByWs(ws);
        if (!turtlee) return;
        turtlee.responseQueue.handleResponse(turtleResponseDTO);
        break;
    }
  }

  public getTurtles(): Turtle[] {
    return this.turtles;
  }

  public getTurtleById(id: number): Turtle | undefined {
    return this.turtles.find((turtle) => turtle.id === id);
  }

  public getTurtleByWs(ws: WebSocket): Turtle | undefined {
    return this.turtles.find((turtle) => turtle.ws === ws);
  }

  public addOrUpdateTurtle(turtle: Turtle): void {
    const index = this.turtles.findIndex((t) => t.id === turtle.id);
    if (index === -1) {
      this.turtles.push(turtle);
    } else {
      let existingTurtle = this.turtles[index];
      existingTurtle.x = turtle.x;
      existingTurtle.y = turtle.y;
      existingTurtle.z = turtle.z;
      existingTurtle.facing = turtle.facing;
      existingTurtle.dimension = turtle.dimension;
      existingTurtle.ws = turtle.ws;
    }
  }

  public removeTurtleById(id: number): void {
    const index = this.turtles.findIndex((turtle) => turtle.id === id);
    if (index !== -1) {
      this.turtles.splice(index, 1);
    }
  }
}
