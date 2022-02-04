import Dimensions from "./Dimensions";
import Directions from "./Directions";
import WebSocket from "ws";
import Actions from "./DTO/action";
import ResponseQueue from "./ResponseQueue";
import Commands from "./Commands";
import JobQueue from "./JobQueue";

export default class Turtle {
  x: number;
  y: number;
  z: number;
  facing: Directions;
  dimension: Dimensions;
  id: number;
  jobQueue: JobQueue;
  ws: WebSocket;

  responseQueue: ResponseQueue;

  constructor(
    x: number,
    y: number,
    z: number,
    facing: Directions,
    dimension: Dimensions,
    id: number,
    ws: WebSocket
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.facing = facing;
    this.dimension = dimension;
    this.id = id;
    this.ws = ws;

    this.responseQueue = new ResponseQueue();
    this.jobQueue = new JobQueue();
  }

  /**
   * Send a raw command to the turtle.
   * @param command The command to send.
   * @param times The number of times to send the command.
   *
   * @example
   * turtle.sendCommand("back", 3);
   */
  send(command: Commands, times?: number): Promise<string> {
    console.log("🐢", this.id, "sending", command, "x" + (times || 1));
    return new Promise((resolve, reject) => {
      const message = {
        action: Actions.Command,
        id: Math.floor(Math.random() * 1000000),
        command,
        times: times || 1,
      };

      this.responseQueue
        .awaitResponse(message.id)
        .then((response) => resolve(response.output));

      this.ws.send(JSON.stringify(message), (err) =>
        err ? reject(err) : null
      );
    });
  }
}
