import Actions from "./action";
import TurtleDTO from "./TurtleDTO";

export default interface TurtleResponseDTO extends TurtleDTO {
  action: Actions.Init;
  output: string;
}
