import { Coords } from '../common/common.types';
import Matrix from '../common/Matrix';

export default class VertexDefinition {
  public coordinates: Coords;
  public flag: boolean;
  public colourIndex: number;

  public copyFromValues(
    xAdj: number,
    y: number,
    zAdj: number,
    minX: number,
    maxX: number,
    minZ: number,
    maxZ: number
  ) {
    let x = this.coordinates[0] + xAdj;
    let z = this.coordinates[2] + zAdj;
    if (x < minX) {
      x = minX;
    }
    if (x > maxX) {
      x = maxX;
    }
    if (z < minZ) {
      z = minZ;
    }
    if (z > maxZ) {
      z = maxZ;
    }
    return new VertexDefinition([x, y, z]);
  }

  public constructor(coordinates: Coords) {
    this.flag = false;
    this.colourIndex = 0;
    this.coordinates = coordinates;
  }

  public copyDirect() {
    return new VertexDefinition(this.coordinates.slice(0) as Coords);
  }

  public getCoords() {
    return this.coordinates;
  }

  public transform(matrix: Matrix) {
    matrix.transformCoords(this.coordinates);
  }
}
