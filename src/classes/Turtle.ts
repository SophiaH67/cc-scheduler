import Dimensions from "./Dimensions";
import Directions from "./Directions";
import TurtleJob from "./TurtleJob";
import WebSocket from "ws";

export default class Turtle {
  x: number;
  y: number;
  z: number;
  facing: Directions;
  dimensions: Dimensions;
  id: number;
  currentJob?: TurtleJob;
  ws: WebSocket;

  constructor(
    x: number,
    y: number,
    z: number,
    facing: Directions,
    dimensions: Dimensions,
    id: number,
    ws: WebSocket
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.facing = facing;
    this.dimensions = dimensions;
    this.id = id;
    this.ws = ws;
  }

  /**
   * Send a raw command to the turtle.
   */
  send(command: Commands, times?: number): void {
    for (let i = 0; i < (times || 0); i++) {
      this.ws.send(command);
    }
  }
}
