import Matrix from '../common/Matrix';

export default class VertexDefinition {
  public coordinates: number[];
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
  ): VertexDefinition {
    let x: number = this.coordinates[0] + xAdj;
    let z: number = this.coordinates[2] + zAdj;
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

  public constructor(coordinates: number[]) {
    this.flag = false;
    this.colourIndex = 0;
    this.coordinates = coordinates;
  }

  public copyDirect(): VertexDefinition {
    return new VertexDefinition(this.coordinates.slice(0));
  }

  public getCoordinates(): number[] {
    return this.coordinates;
  }

  public transform(matrix: Matrix) {
    matrix.transformCoords(this.coordinates);
  }
}
