import TurtleResponseDTO from "./DTO/TurtleResponseDTO";

export default class ResponseQueue {
  private observers: ((response: TurtleResponseDTO) => boolean)[];

  constructor() {
    this.observers = [];
  }

  public awaitResponse(id: number): Promise<TurtleResponseDTO> {
    console.log("🎅", id, "awaiting response");
    return new Promise((resolve, _reject) => {
      this.observers.push((response) => {
        if (response.id === id) {
          console.log("🎉", id, "received response");
          resolve(response);
        }
        return response.id === id;
      });
    });
  }

  public handleResponse(response: TurtleResponseDTO): void {
    const toRemove = this.observers.find((observer) => observer(response));
    console.log("👂", response.id, "received");
    if (toRemove) {
      console.log("🙊", response.id, "removed");
      this.observers = this.observers.filter(
        (observer) => observer !== toRemove
      );
    }
  }
}
