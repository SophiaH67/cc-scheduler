import Dimensions from "../Dimensions";
import Directions from "../Directions";
import Actions from "./action";
import TurtleDTO from "./TurtleDTO";

export default interface TurtleUpdateDTO extends TurtleDTO {
  action: Actions.Update;
  x: number;
  y: number;
  z: number;
  facing: Directions;
  dimension: Dimensions;
  id: number;
}
