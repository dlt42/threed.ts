import Color from '../common/Color';
import Matrix from '../common/Matrix';
import { Rotation } from '../common/Transformation';
import TrigTables from '../common/TrigTables';
import ModelDefinition from './ModelDefinition';
import PolygonDefinition from './PolygonDefinition';
import VertexDefinition from './VertexDefinition';

export default class ModelDefinitionGenerator {
  public static block(
    sizeX: number,
    sizeY: number,
    sizeZ: number,
    color: Color
  ) {
    const vertices: VertexDefinition[] = [];
    vertices[0] = new VertexDefinition([-sizeX, sizeY, -sizeZ]);
    vertices[1] = new VertexDefinition([-sizeX, sizeY, sizeZ]);
    vertices[2] = new VertexDefinition([-sizeX, -sizeY, sizeZ]);
    vertices[3] = new VertexDefinition([-sizeX, -sizeY, -sizeZ]);
    vertices[4] = new VertexDefinition([sizeX, sizeY, -sizeZ]);
    vertices[5] = new VertexDefinition([sizeX, -sizeY, -sizeZ]);
    vertices[6] = new VertexDefinition([sizeX, -sizeY, sizeZ]);
    vertices[7] = new VertexDefinition([sizeX, sizeY, sizeZ]);
    const polygons: PolygonDefinition[] = [];
    let tempVertex1 = vertices[1].copyDirect();
    let tempVertex2 = vertices[3].copyDirect();
    polygons[0] = new PolygonDefinition(
      [tempVertex1, vertices[0].copyDirect(), tempVertex2],
      color
    );
    polygons[1] = new PolygonDefinition(
      [tempVertex1, tempVertex2, vertices[2].copyDirect()],
      color
    );
    tempVertex1 = vertices[4].copyDirect();
    tempVertex2 = vertices[3].copyDirect();
    polygons[2] = new PolygonDefinition(
      [vertices[0].copyDirect(), tempVertex1, tempVertex2],
      color
    );
    polygons[3] = new PolygonDefinition(
      [tempVertex2, tempVertex1, vertices[5].copyDirect()],
      color
    );
    tempVertex1 = vertices[4].copyDirect();
    tempVertex2 = vertices[6].copyDirect();
    polygons[4] = new PolygonDefinition(
      [tempVertex1, vertices[7].copyDirect(), tempVertex2],
      color
    );
    polygons[5] = new PolygonDefinition(
      [tempVertex1, tempVertex2, vertices[5].copyDirect()],
      color
    );
    tempVertex1 = vertices[1].copyDirect();
    tempVertex2 = vertices[6].copyDirect();
    polygons[6] = new PolygonDefinition(
      [vertices[7].copyDirect(), tempVertex1, tempVertex2],
      color
    );
    polygons[7] = new PolygonDefinition(
      [tempVertex2, tempVertex1, vertices[2].copyDirect()],
      color
    );
    tempVertex1 = vertices[3].copyDirect();
    tempVertex2 = vertices[6].copyDirect();
    polygons[8] = new PolygonDefinition(
      [tempVertex1, vertices[5].copyDirect(), tempVertex2],
      color
    );
    polygons[9] = new PolygonDefinition(
      [tempVertex1, tempVertex2, vertices[2].copyDirect()],
      color
    );
    tempVertex1 = vertices[7].copyDirect();
    tempVertex2 = vertices[0].copyDirect();
    polygons[10] = new PolygonDefinition(
      [vertices[1].copyDirect(), tempVertex1, tempVertex2],
      color
    );
    polygons[11] = new PolygonDefinition(
      [tempVertex2, tempVertex1, vertices[4].copyDirect()],
      color
    );
    return new ModelDefinition(polygons);
  }

  public static combineModels(
    targetModel: ModelDefinition,
    srcModel: ModelDefinition,
    copyMatrix: Matrix
  ) {
    const polygonArray: PolygonDefinition[] = targetModel.getPolygons();
    const sourcePolygonArray: PolygonDefinition[] = srcModel.getPolygons();
    const tempPolygonArray: PolygonDefinition[] = [];
    const vertexCopyHashtable: Map<VertexDefinition, VertexDefinition> =
      new Map<VertexDefinition, VertexDefinition>();
    for (let p = 0; p < sourcePolygonArray.length; p++) {
      const sourcePolygon: PolygonDefinition = sourcePolygonArray[p];
      const sourceVertexArray: VertexDefinition[] = sourcePolygon.getVertices();
      const newVertexArray: VertexDefinition[] = [];
      for (let v = 0; v < 3; v++) {
        const sourceVertex = sourceVertexArray[v];
        if (!vertexCopyHashtable.has(sourceVertex)) {
          const newVertex = sourceVertex.copyDirect();
          copyMatrix.transformCoords(newVertex.getCoords());
          vertexCopyHashtable.set(sourceVertex, newVertex);
        }
        newVertexArray[v] = vertexCopyHashtable.get(
          sourceVertex
        ) as VertexDefinition;
      }
      tempPolygonArray[polygonArray.length + p] = new PolygonDefinition(
        newVertexArray,
        sourcePolygon.getColor()
      );
    }
    for (let i = 0; i < polygonArray.length; i++) {
      tempPolygonArray[i] = polygonArray[i];
    }
    targetModel.setPolygons(tempPolygonArray);
  }

  public static cube(size: number, color: Color) {
    const vertices: VertexDefinition[] = [];
    vertices[0] = new VertexDefinition([-size, size, -size]);
    vertices[1] = new VertexDefinition([-size, size, size]);
    vertices[2] = new VertexDefinition([-size, -size, size]);
    vertices[3] = new VertexDefinition([-size, -size, -size]);
    vertices[4] = new VertexDefinition([size, size, -size]);
    vertices[5] = new VertexDefinition([size, -size, -size]);
    vertices[6] = new VertexDefinition([size, -size, size]);
    vertices[7] = new VertexDefinition([size, size, size]);
    const polygons: PolygonDefinition[] = [];
    let tempVertex1 = vertices[1].copyDirect();
    let tempVertex2 = vertices[3].copyDirect();
    polygons[0] = new PolygonDefinition(
      [tempVertex1, vertices[0].copyDirect(), tempVertex2],
      color
    );
    polygons[1] = new PolygonDefinition(
      [tempVertex1, tempVertex2, vertices[2].copyDirect()],
      color
    );
    tempVertex1 = vertices[4].copyDirect();
    tempVertex2 = vertices[3].copyDirect();
    polygons[2] = new PolygonDefinition(
      [vertices[0].copyDirect(), tempVertex1, tempVertex2],
      color
    );
    polygons[3] = new PolygonDefinition(
      [tempVertex2, tempVertex1, vertices[5].copyDirect()],
      color
    );
    tempVertex1 = vertices[4].copyDirect();
    tempVertex2 = vertices[6].copyDirect();
    polygons[4] = new PolygonDefinition(
      [tempVertex1, vertices[7].copyDirect(), tempVertex2],
      color
    );
    polygons[5] = new PolygonDefinition(
      [tempVertex1, tempVertex2, vertices[5].copyDirect()],
      color
    );
    tempVertex1 = vertices[1].copyDirect();
    tempVertex2 = vertices[6].copyDirect();
    polygons[6] = new PolygonDefinition(
      [vertices[7].copyDirect(), tempVertex1, tempVertex2],
      color
    );
    polygons[7] = new PolygonDefinition(
      [tempVertex2, tempVertex1, vertices[2].copyDirect()],
      color
    );
    tempVertex1 = vertices[3].copyDirect();
    tempVertex2 = vertices[6].copyDirect();
    polygons[8] = new PolygonDefinition(
      [tempVertex1, vertices[5].copyDirect(), tempVertex2],
      color
    );
    polygons[9] = new PolygonDefinition(
      [tempVertex1, tempVertex2, vertices[2].copyDirect()],
      color
    );
    tempVertex1 = vertices[7].copyDirect();
    tempVertex2 = vertices[0].copyDirect();
    polygons[10] = new PolygonDefinition(
      [vertices[1].copyDirect(), tempVertex1, tempVertex2],
      color
    );
    polygons[11] = new PolygonDefinition(
      [tempVertex2, tempVertex1, vertices[4].copyDirect()],
      color
    );
    return new ModelDefinition(polygons);
  }

  public static cylinder(
    radius: number,
    height: number,
    numpoints: number,
    color: Color
  ) {
    const vertices: VertexDefinition[] = [];
    const h = height / 2;
    for (let l = 0; l < numpoints; l++) {
      const a = (360 / numpoints) * l;
      const x = TrigTables.sinValues360[(a | 0) % 360] * radius;
      const z = TrigTables.cosValues360[(a | 0) % 360] * radius;
      vertices[l] = new VertexDefinition([x, -h, z]);
    }
    for (let l = 0; l < numpoints; l++) {
      const a = (360 / numpoints) * l;
      const x = TrigTables.sinValues360[(a | 0) % 360] * radius;
      const z = TrigTables.cosValues360[(a | 0) % 360] * radius;
      vertices[l + numpoints] = new VertexDefinition([x, h, z]);
    }
    vertices[numpoints * 2] = new VertexDefinition([0, -h, 0]);
    vertices[numpoints * 2 + 1] = new VertexDefinition([0, h, 0]);
    const polygons: PolygonDefinition[] = [];
    for (let t = 0; t < numpoints; t++)
      polygons[t] = new PolygonDefinition(
        [vertices[t], vertices[(t + 1) % numpoints], vertices[t + numpoints]],
        color
      );

    for (let u = 0; u < numpoints; u++)
      polygons[u + numpoints] = new PolygonDefinition(
        [
          vertices[u + numpoints],
          vertices[(u + 1) % numpoints],
          vertices[((u + 1) % numpoints) + numpoints],
        ],
        color
      );
    for (let v = 0; v < numpoints; v++)
      polygons[v + numpoints * 2] = new PolygonDefinition(
        [
          vertices[v + numpoints].copyDirect(),
          vertices[((v + 1) % numpoints) + numpoints].copyDirect(),
          vertices[numpoints * 2 + 1].copyDirect(),
        ],
        color
      );

    for (let w = 0; w < numpoints; w++)
      polygons[w + numpoints * 3] = new PolygonDefinition(
        [
          vertices[w].copyDirect(),
          vertices[numpoints * 2].copyDirect(),
          vertices[(w + 1) % numpoints].copyDirect(),
        ],
        color
      );

    return new ModelDefinition(polygons);
  }

  public static getSphereCoords(
    radius: number,
    angle: number,
    numpoints: number
  ) {
    const vertices: VertexDefinition[] = [];
    const matrix: Matrix = Matrix.getRotationMatrix(
      new Rotation({ x: angle, y: 0, z: 0 })
    );
    const split = 180.0 / numpoints;
    for (let i = 0; i < numpoints; i++) {
      // Use trigonometry to find each vertice.
      const x = TrigTables.cosValues360[((split * i) | 0) % 360] * radius;
      const y = TrigTables.sinValues360[((split * i) | 0) % 360] * radius;
      const z = 0;

      // Declare the vertex.
      vertices[i] = new VertexDefinition([x, y, z]);

      // Transform the vertex into the correct position.
      matrix.transformCoords(vertices[i].getCoords());
    }
    return vertices;
  }

  public static sphere(radius: number, numpoints: number, color: Color) {
    const MDG = ModelDefinitionGenerator;

    const vertices: VertexDefinition[][] = [];
    const polygons: Array<PolygonDefinition> = [];
    const split = 360.0 / numpoints;

    for (let i = 0; i < numpoints; i++)
      vertices[i] = MDG.getSphereCoords(radius, split * i, numpoints);

    for (let i = 0; i < numpoints; i++) {
      for (let j = 1; j < numpoints - 1; j++) {
        const v1A = vertices[i][j];
        const v1B = vertices[i][(j + 1) % numpoints];
        const v2A = vertices[(i + 1) % numpoints][j];
        const v2B = vertices[(i + 1) % numpoints][(j + 1) % numpoints];
        polygons.push(new PolygonDefinition([v1A, v1B, v2A], color));
        polygons.push(new PolygonDefinition([v2A, v1B, v2B], color));
      }
    }

    const end1 = new VertexDefinition([radius, 0, 0]);
    const end2 = new VertexDefinition([-radius, 0, 0]);
    for (let i = 0; i < numpoints; i++) {
      const v1A = vertices[i][1];
      const v2A = vertices[(i + 1) % numpoints][1];
      polygons.push(new PolygonDefinition([v1A, v2A, end1], color));
      const v1B = vertices[i][numpoints - 1];
      const v2B = vertices[(i + 1) % numpoints][numpoints - 1];
      polygons.push(new PolygonDefinition([v2B, v1B, end2], color));
    }
    return new ModelDefinition(polygons);
  }

  public static surfaceXY(size: number, color: Color) {
    const vertices: VertexDefinition[] = [];
    vertices[0] = new VertexDefinition([-size, -size, 0]);
    vertices[1] = new VertexDefinition([-size, size, 0]);
    vertices[2] = new VertexDefinition([size, size, 0]);
    vertices[3] = new VertexDefinition([size, -size, 0]);
    const polygons: PolygonDefinition[] = [];
    polygons[0] = new PolygonDefinition(
      [vertices[0], vertices[1], vertices[2]],
      color
    );
    polygons[1] = new PolygonDefinition(
      [vertices[2], vertices[3], vertices[0]],
      color
    );
    polygons[2] = new PolygonDefinition(
      [vertices[1], vertices[0], vertices[2]],
      color
    );
    polygons[3] = new PolygonDefinition(
      [vertices[0], vertices[3], vertices[2]],
      color
    );
    return new ModelDefinition(polygons);
  }

  public static surfaceXZ(size: number, color: Color) {
    const vertices: VertexDefinition[] = [];
    vertices[0] = new VertexDefinition([-size, 0, -size]);
    vertices[1] = new VertexDefinition([-size, 0, size]);
    vertices[2] = new VertexDefinition([size, 0, size]);
    vertices[3] = new VertexDefinition([size, 0, -size]);
    const polygons: PolygonDefinition[] = [];
    polygons[0] = new PolygonDefinition(
      [vertices[0], vertices[1], vertices[2]],
      color
    );
    polygons[1] = new PolygonDefinition(
      [vertices[2], vertices[3], vertices[0]],
      color
    );
    polygons[2] = new PolygonDefinition(
      [vertices[1], vertices[0], vertices[2]],
      color
    );
    polygons[3] = new PolygonDefinition(
      [vertices[0], vertices[3], vertices[2]],
      color
    );
    return new ModelDefinition(polygons);
  }

  public static tube(
    radius1: number,
    radius2: number,
    height: number,
    numpoints: number,
    color: Color
  ) {
    const vertices1: VertexDefinition[] = [];
    const vertices2: VertexDefinition[] = [];
    const h = height / 2;
    for (let l = 0; l < numpoints; l++) {
      const a = (360 / numpoints) * l;
      const x1 = TrigTables.sinValues360[a % 360] * radius1;
      const z1 = TrigTables.cosValues360[a % 360] * radius1;
      vertices1[l] = new VertexDefinition([x1, -h, z1]);
      vertices2[l] = new VertexDefinition([x1, -h, z1]);
    }
    for (let l = 0; l < numpoints; l++) {
      const a = (360 / numpoints) * l;
      const x1 = TrigTables.sinValues360[a % 360] * radius1;
      const z1 = TrigTables.cosValues360[a % 360] * radius1;
      const x2 = TrigTables.sinValues360[a % 360] * radius2;
      const z2 = TrigTables.cosValues360[a % 360] * radius2;
      vertices1[l + numpoints] = new VertexDefinition([x1, h, z1]);
      vertices2[l + numpoints] = new VertexDefinition([x2, h, z2]);
    }
    const polygons: PolygonDefinition[] = [];
    for (let t = 0; t < numpoints; t++) {
      polygons[t] = new PolygonDefinition(
        [
          vertices1[t],
          vertices1[(t + 1) % numpoints],
          vertices1[t + numpoints],
        ],
        color
      );
      polygons[t + numpoints] = new PolygonDefinition(
        [
          vertices2[t],
          vertices2[t + numpoints],
          vertices2[(t + 1) % numpoints],
        ],
        color
      );
    }
    for (let u = 0; u < numpoints; u++) {
      polygons[u + numpoints * 2] = new PolygonDefinition(
        [
          vertices1[u + numpoints],
          vertices1[(u + 1) % numpoints],
          vertices1[((u + 1) % numpoints) + numpoints],
        ],
        color
      );
      polygons[u + numpoints * 3] = new PolygonDefinition(
        [
          vertices2[u + numpoints],
          vertices2[((u + 1) % numpoints) + numpoints],
          vertices2[(u + 1) % numpoints],
        ],
        color
      );
    }
    for (let v = 0; v < numpoints; v++) {
      polygons[v + numpoints * 4] = new PolygonDefinition(
        [
          vertices1[v + numpoints].copyDirect(),
          vertices1[((v + 1) % numpoints) + numpoints].copyDirect(),
          vertices2[((v + 1) % numpoints) + numpoints].copyDirect(),
        ],
        color
      );
      polygons[v + numpoints * 5] = new PolygonDefinition(
        [
          vertices2[v + numpoints].copyDirect(),
          vertices1[v + numpoints].copyDirect(),
          vertices2[((v + 1) % numpoints) + numpoints].copyDirect(),
        ],
        color
      );
    }
    return new ModelDefinition(polygons);
  }

  constructor() {}
}
