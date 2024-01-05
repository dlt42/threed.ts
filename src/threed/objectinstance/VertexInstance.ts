import IntensityTable from './IntensityTable';

export default class VertexInstance extends IntensityTable {
  public worldCoordinates: number[];
  public viewCoordinates: number[] = [0, 0, 0];
  public screenCoordinates: number[] = [0, 0, 0];
  public modelCoordinates: number[];
  public colourIndex: number;

  public constructor(
    params:
      | {
          type: 'world';
          colourIndex: number;
          worldCoordinates: number[];
        }
      | {
          type: 'model';
          colourIndex: number;
          viewCoordinates: number[];
          normal: number[];
          intensity: number;
          modelCoordinates: number[];
        }
  ) {
    super();
    if (params.type === 'world') {
      const { colourIndex, worldCoordinates } = params;
      this.modelCoordinates = Array.from(worldCoordinates);
      this.worldCoordinates = worldCoordinates;
      this.viewCoordinates = [0, 0, 0];
      this.screenCoordinates = [0, 0, 0];
      this.colourIndex = colourIndex;
    } else {
      const {
        colourIndex,
        intensity,
        modelCoordinates,
        normal,
        viewCoordinates,
      } = params;
      this.modelCoordinates = modelCoordinates;
      this.worldCoordinates = [0, 0, 0];
      this.viewCoordinates = viewCoordinates;
      this.screenCoordinates = [0, 0, 0];
      this.colourIndex = colourIndex;
      this.setIntensity(normal, intensity);
    }
  }

  public static getIntersectingPoint(
    vertexA: VertexInstance,
    vertexB: VertexInstance,
    t: number
  ): number[] {
    return [
      vertexA.modelCoordinates[0] +
        t * (vertexB.modelCoordinates[0] - vertexA.modelCoordinates[0]),
      vertexA.modelCoordinates[1] +
        t * (vertexB.modelCoordinates[1] - vertexA.modelCoordinates[1]),
      vertexA.modelCoordinates[2] +
        t * (vertexB.modelCoordinates[2] - vertexA.modelCoordinates[2]),
    ];
  }

  public getIntersectingPoint(vertexB: VertexInstance, t: number): number[] {
    return [
      this.modelCoordinates[0] +
        t * (vertexB.modelCoordinates[0] - this.modelCoordinates[0]),
      this.modelCoordinates[1] +
        t * (vertexB.modelCoordinates[1] - this.modelCoordinates[1]),
      this.modelCoordinates[2] +
        t * (vertexB.modelCoordinates[2] - this.modelCoordinates[2]),
    ];
  }
}
