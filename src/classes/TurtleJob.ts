import Turtle from "./Turtle";

/**
 * TurtleJob is a base class for all turtle jobs.
 */
export default class TurtleJob {
  turtle: Turtle;

  constructor(turtle: Turtle) {
    this.turtle = turtle;
  }
}
