import BaseJob from "./jobs/generics/BaseJob";

export default class JobQueue {
  private queue: BaseJob[] = [];

  /**
   * Queue a job at the front of the queue.
   * @param job The job to queue.
   *
   * @example
   * queue.queueFront(new MoveForwardJob(turtle, 10));
   */
  public queueFront(job: BaseJob): Promise<BaseJob> {
    this.queue.unshift(job);
    return this.frontJob() as Promise<BaseJob>; // Null is never returned, since we just queued a job.
  }

  /**
   * Ensure the front job is running. If it is not, run it. When it finishes, resolve the promise with the job.
   * @returns The job that finished. If the queue is empty, resolve with null.
   * @example
   * const job = await queue.frontJob();
   */
  public frontJob(): Promise<BaseJob | null> {
    return new Promise((resolve, reject) => {
      if (this.queue.length === 0) {
        resolve(null);
      } else if (this.queue[0].progress === 1) {
        this.queue.shift();
        this.frontJob().then(resolve, reject);
      } else {
        const job = this.queue[0];
        job.on("progress", (progress: number) => {
          if (progress === 1) {
            resolve(job);
          }
        });
        job.start();
      }
    });
  }
}
