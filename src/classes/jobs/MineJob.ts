import Coords from "../Coords";
import Turtle from "../Turtle";
import BaseJob from "./generics/BaseJob";

export default class MineJob extends BaseJob {
  coords1: Coords;
  coords2: Coords;
  coordsDiff: Coords;
  chestCoords: Coords;

  // State
  xMined: number = 0;
  yMined: number = 0;
  zMined: number = 0;

  constructor(
    TurtleOrParent: Turtle | BaseJob,
    coords1: Coords,
    coords2: Coords,
    chestCoords: Coords
  ) {
    super(TurtleOrParent);

    this.coords1 = {
      x: Math.min(coords1.x, coords2.x),
      y: Math.min(coords1.y, coords2.y),
      z: Math.min(coords1.z, coords2.z),
    };
    this.coords2 = {
      x: Math.max(coords1.x, coords2.x),
      y: Math.max(coords1.y, coords2.y),
      z: Math.max(coords1.z, coords2.z),
    };
    this.coordsDiff = {
      x: this.coords2.x - this.coords1.x,
      y: this.coords2.y - this.coords1.y,
      z: this.coords2.z - this.coords1.z,
    };
    this.chestCoords = chestCoords;
  }

  get progress(): number {
    return (
      (this.xMined + this.yMined + this.zMined) /
      (this.coordsDiff.x + this.coordsDiff.y + this.coordsDiff.z)
    );
  }

  public start(): void {
    // Queue pathfind job to location
  }

  public stop(): void {}
}
