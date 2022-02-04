import Commands from "../Commands";
import Turtle from "../Turtle";
import BaseJob from "./generics/BaseJob";

export default class MoveForwardJob extends BaseJob {
  private distance: number;
  private moved: number = 0;

  constructor(TurtleOrParent: Turtle | BaseJob, distance: number) {
    super(TurtleOrParent);

    this.distance = distance;
  }

  get progress() {
    return this.moved / this.distance;
  }

  public start(): void {
    let direction: Commands;
    switch (this.turtle.facing) {
      case "NORTH":
        direction = Commands.moveNorth;
        break;
      case "EAST":
        direction = Commands.moveEast;
        break;
      case "SOUTH":
        direction = Commands.moveSouth;
        break;
      case "WEST":
        direction = Commands.moveWest;
        break;
      default:
        throw new Error("Invalid facing direction");
    }
    for (let i = 0; i < this.distance; i++) {
      this.turtle.send(direction).then(() => {
        this.moved++;
        this.emit("progress", this.progress);
      });
    }
  }
}
