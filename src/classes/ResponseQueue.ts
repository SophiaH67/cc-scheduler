import TurtleResponseDTO from "./DTO/TurtleResponseDTO";

export default class ResponseQueue {
  private observers: ((response: TurtleResponseDTO) => boolean)[];

  constructor() {
    this.observers = [];
  }

  public awaitResponse(id: number): Promise<TurtleResponseDTO> {
    return new Promise((resolve, _reject) => {
      this.observers.push((response) => {
        if (response.id === id) {
          resolve(response);
        }
        return response.id === id;
      });
    });
  }

  public handleResponse(response: TurtleResponseDTO): void {
    const toRemove = this.observers.find((observer) => observer(response));
    if (toRemove) {
      this.observers = this.observers.filter(
        (observer) => observer !== toRemove
      );
    }
  }
}
