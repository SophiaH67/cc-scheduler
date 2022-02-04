import Actions from "./action";
import TurtleDTO from "./TurtleDTO";

export default interface TurtleResponseDTO extends TurtleDTO {
  action: Actions.Response;
  id: number /** The id of the command */;
  output: string;
}
