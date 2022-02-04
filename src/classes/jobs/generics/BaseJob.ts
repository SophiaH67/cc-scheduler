import Turtle from "../../Turtle";

/**
 * BaseJob is a base class for all turtle jobs.
 */
export default class BaseJob {
  listeners: { [key: string]: Function[] } = {};
  turtle: Turtle;
  running: boolean = false;
  parent: BaseJob | null = null;

  constructor(TurtleOrParent: Turtle | BaseJob) {
    if (TurtleOrParent instanceof Turtle) {
      this.turtle = TurtleOrParent;
    } else {
      this.turtle = TurtleOrParent.turtle;
      this.parent = TurtleOrParent;
    }
    this.listeners = {};
  }

  public start() {
    throw new Error("Method not implemented.");
  }
  public stop() {
    throw new Error("Method not implemented.");
  }

  /**
   * Returns the progress of the job. 0.0 is 0% complete, 1.0 is 100% complete.
   * @returns {number}
   * @memberof RunnableJob
   */
  get progress(): number {
    throw new Error("Method not implemented.");
  }

  /**
   * Adds a listener to the job.
   * @param {string} event The event to listen to.
   * @param {Function} listener The listener to add.
   * @memberof RunnableJob
   * @returns {void}
   * @example
   * const job = new MoveForwardJob(turtle, 10);
   * job.on("progress", (progress: number) => {
   *  console.log(progress);
   * });
   */
  public on(event: string, listener: Function): void {
    if (this.listeners[event]) {
      this.listeners[event].push(listener);
    } else {
      this.listeners[event] = [listener];
    }
  }

  /**
   * Emits an event to the job.
   * @param {string} event The event to emit.
   * @param {...any[]} args The arguments to pass to the listeners.
   * @memberof RunnableJob
   * @returns {void}
   * @example
   * this.emit("progress", 0.5);
   */
  public emit(event: string, ...args: any[]): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener: Function) => {
        listener(...args);
      });
    }
  }
}
