import TurtleInitDTO from "./DTO/TurtleInitDTO";
import TurtleResponseDTO from "./DTO/TurtleResponseDTO";
import Turtle from "./Turtle";
import Actions from "./DTO/action";
import WebSocket, { WebSocketServer } from "ws";
import PathfindJob from "./jobs/PathfindJob";

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
    const data: TurtleResponseDTO | TurtleInitDTO = JSON.parse(message);
    switch (data.action) {
      // Actions.Init is used for both initializing a new turtle and updating an existing turtle.
      case Actions.Init:
        const turtleInitDTO: TurtleInitDTO = data;
        this.addOrUpdateTurtle(
          new Turtle(
            turtleInitDTO.x,
            turtleInitDTO.y,
            turtleInitDTO.z,
            turtleInitDTO.facing,
            turtleInitDTO.dimension,
            turtleInitDTO.id,
            ws
          )
        );
        break;
      case Actions.Response:
        const turtleResponseDTO: TurtleResponseDTO = data;
        const turtle = this.getTurtleByWs(ws);
        if (!turtle) return;
        turtle.responseQueue.handleResponse(turtleResponseDTO);
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

    const job = new PathfindJob(turtle, { x: 46, y: 75, z: 114 });
    job.on("progress", (progress: number) =>
      console.log(`Turtle ${turtle.id} is ${progress * 100}% done`)
    );
    turtle.jobQueue
      .queueFront(job)
      .then(() =>
        console.log(
          `Turtle ${turtle.id} is done with job ${job.constructor.name}`
        )
      );
  }

  public removeTurtleById(id: number): void {
    const index = this.turtles.findIndex((turtle) => turtle.id === id);
    if (index !== -1) {
      this.turtles.splice(index, 1);
    }
  }
}
