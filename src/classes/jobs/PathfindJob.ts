import bezosmapsFindPath from "../../api/bezosmapsFindPath";
import Commands from "../Commands";
import Coords from "../Coords";
import Turtle from "../Turtle";
import BaseJob from "./generics/BaseJob";

export default class PathfindJob extends BaseJob {
  private path: Coords[];
  private target: Coords;
  private currentPathIndex: number = 0;

  constructor(TurtleOrParent: Turtle | BaseJob, target: Coords) {
    super(TurtleOrParent);

    this.target = target;
    this.path = [{ x: 0, y: 0, z: 0 }]; // Initialize with a dummy path, so that the progress is 0
  }

  public start(): void {
    bezosmapsFindPath(
      {
        x: this.turtle.x,
        y: this.turtle.y,
        z: this.turtle.z,
      },
      this.target
    ).then((path) => {
      this.path = path;
      this.emit("progress", this.progress);
      this.nextStep();
    });
  }

  private async nextStep() {
    if (this.currentPathIndex >= this.path.length) {
      this.emit("progress", this.progress);
      return;
    }

    const nextCoords = this.path[this.currentPathIndex];
    const direction = this.getDirection(nextCoords);

    await this.turtle.send(direction);
    this.currentPathIndex++;
    this.emit("progress", this.progress);
    this.nextStep();
  }

  private getDirection(nextCoords: Coords): Commands {
    const xDiff = nextCoords.x - this.turtle.x;
    const yDiff = nextCoords.y - this.turtle.y;
    const zDiff = nextCoords.z - this.turtle.z;

    if (xDiff === 1) {
      return Commands.moveEast;
    } else if (xDiff === -1) {
      return Commands.moveWest;
    } else if (yDiff === 1) {
      return Commands.moveUp;
    } else if (yDiff === -1) {
      return Commands.moveDown;
    } else if (zDiff === 1) {
      return Commands.moveSouth;
    } else if (zDiff === -1) {
      return Commands.moveNorth;
    } else {
      return Commands.noOp;
    }
  }

  public stop(): void {}

  public get progress(): number {
    return this.currentPathIndex / this.path.length;
  }
}
