import { Coords } from '../common/common.types';
import IntensityTable from './IntensityTable';

export default class VertexInstance extends IntensityTable {
  public worldCoords: Coords;
  public viewCoords: Coords = [0, 0, 0];
  public screenCoords: Coords = [0, 0, 0];
  public modelCoords: Coords;
  public colourIndex: number;

  public constructor(
    params:
      | {
          type: 'world';
          colourIndex: number;
          worldCoords: Coords;
        }
      | {
          type: 'model';
          colourIndex: number;
          viewCoords: Coords;
          normal: number[];
          intensity: number;
          modelCoords: Coords;
        }
  ) {
    super();
    if (params.type === 'world') {
      const { colourIndex, worldCoords } = params;
      this.modelCoords = worldCoords.slice(0) as Coords;
      this.worldCoords = worldCoords;
      this.viewCoords = [0, 0, 0];
      this.screenCoords = [0, 0, 0];
      this.colourIndex = colourIndex;
    } else {
      const { colourIndex, intensity, modelCoords, normal, viewCoords } =
        params;
      this.modelCoords = modelCoords;
      this.worldCoords = [0, 0, 0];
      this.viewCoords = viewCoords;
      this.screenCoords = [0, 0, 0];
      this.colourIndex = colourIndex;
      this.setIntensity(normal, intensity);
    }
  }

  public static getIntersectingPoint(
    vertexA: VertexInstance,
    vertexB: VertexInstance,
    t: number
  ) {
    const result: Coords = [
      vertexA.modelCoords[0] +
        t * (vertexB.modelCoords[0] - vertexA.modelCoords[0]),
      vertexA.modelCoords[1] +
        t * (vertexB.modelCoords[1] - vertexA.modelCoords[1]),
      vertexA.modelCoords[2] +
        t * (vertexB.modelCoords[2] - vertexA.modelCoords[2]),
    ];
    return result;
  }

  public getIntersectingPoint(vertexB: VertexInstance, t: number) {
    const result: Coords = [
      this.modelCoords[0] + t * (vertexB.modelCoords[0] - this.modelCoords[0]),
      this.modelCoords[1] + t * (vertexB.modelCoords[1] - this.modelCoords[1]),
      this.modelCoords[2] + t * (vertexB.modelCoords[2] - this.modelCoords[2]),
    ];
    return result;
  }
}
