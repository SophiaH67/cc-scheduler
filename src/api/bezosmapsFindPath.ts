import { request } from "undici";
import Coords from "src/classes/Coords";

interface BezosMapsPathDTO {
  path: string;
}

interface BezosMapsErrorDTO {
  error: string;
}

export default async function bezosmapsFindPath(
  start: Coords,
  target: Coords
): Promise<Coords[]> {
  const url = `https://bezosmaps.marnixah.com/path/${start.x}/${start.y}/${start.z}/${target.x}/${target.y}/${target.z}`;
  const response = await request(url);
  const data: BezosMapsPathDTO | BezosMapsErrorDTO = await response.body.json();
  if ("error" in data) {
    throw new Error(data.error);
  }
  const path: Coords[] = data.path.split(";").map((coords) => {
    const [x, y, z] = coords.split(",");
    return { x: Number(x), y: Number(y), z: Number(z) };
  });

  return path;
}
