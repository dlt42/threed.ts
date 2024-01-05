import Matrix from '../common/Matrix';
import Translation from '../common/Translation';
import PolygonDefinition from './PolygonDefinition';
import VertexDefinition from './VertexDefinition';

export default class ModelDefinition {
  private polygonArray: PolygonDefinition[];

  public constructor(polygonArray: PolygonDefinition[]) {
    this.polygonArray = polygonArray;
  }

  public centreOnOrigin() {
    const initialCoordinates: number[] = this.polygonArray[0]
      .getVertices()[0]
      .getCoordinates();
    let maxX: number = initialCoordinates[0];
    let maxY: number = initialCoordinates[1];
    let maxZ: number = initialCoordinates[2];
    let minX: number = initialCoordinates[0];
    let minY: number = initialCoordinates[1];
    let minZ: number = initialCoordinates[2];
    for (let index = 0; index < this.polygonArray.length; index++) {
      const polygon = this.polygonArray[index];
      const vertexArray: VertexDefinition[] = polygon.getVertices();
      for (let v: number = 0; v < 3; v++) {
        const vertex: VertexDefinition = vertexArray[v];
        const localCoordinates: number[] = vertex.getCoordinates();
        const x: number = localCoordinates[0];
        const y: number = localCoordinates[1];
        const z: number = localCoordinates[2];
        if (x < minX) {
          minX = x;
        } else if (x > maxX) {
          maxX = x;
        }
        if (y < minY) {
          minY = y;
        } else if (y > maxY) {
          maxY = y;
        }
        if (z < minZ) {
          minZ = z;
        } else if (z > maxZ) {
          maxZ = z;
        }
      }
    }
    const centreX: number = (maxX - minX) / 2 + minX;
    const centreY: number = (maxY - minY) / 2 + minY;
    const centreZ: number = (maxZ - minZ) / 2 + minZ;
    const translate: Matrix = Matrix.getTranslationMatrixForTranslation(
      new Translation(-centreX, -centreY, -centreZ)
    );
    this.transform(translate);
  }

  public getPolygons(): PolygonDefinition[] {
    return this.polygonArray;
  }

  private getVertices(): VertexDefinition[] {
    const vertices: Array<VertexDefinition> = [];
    for (let index = 0; index < this.polygonArray.length; index++) {
      const polygon = this.polygonArray[index];
      const array = polygon.getVertices();
      for (let index1 = 0; index1 < array.length; index1++) {
        const vertex = array[index1];
        if (!vertex.flag) {
          vertex.flag = true;
          vertices.push(vertex);
        }
      }
    }
    const verticeArray: VertexDefinition[] = vertices.slice(0);
    for (let i: number = 0; i < verticeArray.length; i++)
      verticeArray[i].flag = false;
    return verticeArray;
  }

  public setPolygons(polygons: PolygonDefinition[]) {
    this.polygonArray = polygons;
  }

  public transform(matrix: Matrix) {
    const vertices: VertexDefinition[] = this.getVertices();
    for (let index = 0; index < vertices.length; index++)
      vertices[index].transform(matrix);
  }
}
