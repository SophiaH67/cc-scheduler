import Dimensions from "../Dimensions";
import Directions from "../Directions";
import Actions from "./action";
import TurtleDTO from "./TurtleDTO";

export default interface TurtleInitDTO extends TurtleDTO {
  action: Actions.Init;
  x: number;
  y: number;
  z: number;
  facing: Directions;
  dimension: Dimensions;
  id: number;
}
