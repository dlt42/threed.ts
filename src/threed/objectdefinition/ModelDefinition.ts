import { Coords } from '../common/common.types';
import Matrix from '../common/Matrix';
import { Translation } from '../common/Transformation';
import PolygonDefinition from './PolygonDefinition';
import VertexDefinition from './VertexDefinition';

export default class ModelDefinition {
  private polygonArray: PolygonDefinition[];

  public constructor(polygonArray: PolygonDefinition[]) {
    this.polygonArray = polygonArray;
  }

  public centreOnOrigin() {
    const initialCoords: Coords = this.polygonArray[0]
      .getVertices()[0]
      .getCoords();
    let maxX = initialCoords[0];
    let maxY = initialCoords[1];
    let maxZ = initialCoords[2];
    let minX = initialCoords[0];
    let minY = initialCoords[1];
    let minZ = initialCoords[2];
    for (let index = 0; index < this.polygonArray.length; index++) {
      const polygon = this.polygonArray[index];
      const vertexArray: VertexDefinition[] = polygon.getVertices();
      for (let v = 0; v < 3; v++) {
        const vertex: VertexDefinition = vertexArray[v];
        const localCoords: Coords = vertex.getCoords();
        const x = localCoords[0];
        const y = localCoords[1];
        const z = localCoords[2];
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
    const centreX = (maxX - minX) / 2 + minX;
    const centreY = (maxY - minY) / 2 + minY;
    const centreZ = (maxZ - minZ) / 2 + minZ;
    const translate: Matrix = Matrix.getTranslationMatrixForTranslation(
      new Translation({ x: -centreX, y: -centreY, z: -centreZ })
    );
    this.transform(translate);
  }

  public getPolygons() {
    return this.polygonArray;
  }

  private getVertices() {
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
    for (let i = 0; i < verticeArray.length; i++) verticeArray[i].flag = false;
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
