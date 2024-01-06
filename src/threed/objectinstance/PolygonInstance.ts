import Color from '../common/Color';
import { Coords } from '../common/common.types';
import VertexInstance from './VertexInstance';

export default class PolygonInstance {
  public culled: boolean = false;
  public vertexArray: VertexInstance[];
  private v0: VertexInstance | null = null;
  private v1: VertexInstance | null = null;
  private v2: VertexInstance | null = null;
  public color: Color;
  public surfaceNormal: number[];

  public static calculateNormal(
    coordinates0: Coords,
    coordinates1: Coords,
    coordinates2: Coords
  ) {
    let x1 = coordinates2[0] - coordinates0[0];
    let y1 = coordinates2[1] - coordinates0[1];
    let z1 = coordinates2[2] - coordinates0[2];
    let x2 = coordinates1[0] - coordinates0[0];
    let y2 = coordinates1[1] - coordinates0[1];
    let z2 = coordinates1[2] - coordinates0[2];
    let magnitude = 1 / Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1);
    x1 *= magnitude;
    y1 *= magnitude;
    z1 *= magnitude;
    magnitude = 1 / Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
    x2 *= magnitude;
    y2 *= magnitude;
    z2 *= magnitude;
    const x3 = y1 * z2 - z1 * y2;
    const y3 = z1 * x2 - x1 * z2;
    const z3 = x1 * y2 - y1 * x2;
    magnitude = 1 / Math.sqrt(x3 * x3 + y3 * y3 + z3 * z3);
    return [x3 * magnitude, y3 * magnitude, z3 * magnitude];
  }

  public constructor(...args: unknown[]) {
    switch (args.length) {
      case 2: {
        const [vertices, color] = args as [VertexInstance[], Color];
        this.vertexArray = vertices;
        this.v0 = vertices[0];
        this.v1 = vertices[1];
        this.v2 = vertices[2];
        this.color = color;
        this.surfaceNormal = PolygonInstance.calculateNormal(
          this.v0.worldCoords,
          this.v1.worldCoords,
          this.v2.worldCoords
        );
        for (const element of this.vertexArray)
          element.addSurfaceNormal(this.surfaceNormal);
        break;
      }
      case 3: {
        const [vertices, color, normal] = args as [
          VertexInstance[],
          Color,
          number[],
        ];
        this.vertexArray = vertices;
        this.v0 = vertices[0];
        this.v1 = vertices[1];
        this.v2 = vertices[2];
        this.color = color;
        this.surfaceNormal = normal;
        break;
      }
      default: {
        throw new Error(`Invalid number of arguments`);
      }
    }
  }

  public calculateNormal() {
    if (!this.v0 || !this.v1 || !this.v2)
      throw Error('Polygon instance not initialised correctly');
    let x1 = this.v2.worldCoords[0] - this.v0.worldCoords[0];
    let y1 = this.v2.worldCoords[1] - this.v0.worldCoords[1];
    let z1 = this.v2.worldCoords[2] - this.v0.worldCoords[2];
    let x2 = this.v1.worldCoords[0] - this.v0.worldCoords[0];
    let y2 = this.v1.worldCoords[1] - this.v0.worldCoords[1];
    let z2 = this.v1.worldCoords[2] - this.v0.worldCoords[2];
    let magnitude = 1 / Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1);
    x1 *= magnitude;
    y1 *= magnitude;
    z1 *= magnitude;
    magnitude = 1 / Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
    x2 *= magnitude;
    y2 *= magnitude;
    z2 *= magnitude;
    const x3 = y1 * z2 - z1 * y2;
    const y3 = z1 * x2 - x1 * z2;
    const z3 = x1 * y2 - y1 * x2;
    magnitude = 1 / Math.sqrt(x3 * x3 + y3 * y3 + z3 * z3);
    this.surfaceNormal[0] = x3 * magnitude;
    this.surfaceNormal[1] = y3 * magnitude;
    this.surfaceNormal[2] = z3 * magnitude;
  }
}
