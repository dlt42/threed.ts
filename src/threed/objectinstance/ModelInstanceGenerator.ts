import Vector3D from '../common/Vector3D';
import ModelDefinition from '../objectdefinition/ModelDefinition';
import PolygonDefinition from '../objectdefinition/PolygonDefinition';
import VertexDefinition from '../objectdefinition/VertexDefinition';
import ModelInstance from './ModelInstance';
import PolygonInstance from './PolygonInstance';
import VertexInstance from './VertexInstance';

export default class ModelInstanceGenerator {
  public generateInstance(model: ModelDefinition): ModelInstance {
    let radius: number = 0;
    const polygonDefinitionArray: PolygonDefinition[] = model.getPolygons();
    const polygonInstanceArray: PolygonInstance[] = new Array<PolygonInstance>(
      polygonDefinitionArray.length
    );
    const vertexInstanceHashtable: Map<VertexDefinition, VertexInstance> =
      new Map<VertexDefinition, VertexInstance>();
    const position: number[] = [0, 0, 0];
    for (let p: number = 0; p < polygonDefinitionArray.length; p++) {
      const polygon: PolygonDefinition = polygonDefinitionArray[p];
      const vertexArray: VertexDefinition[] = polygon.getVertices();
      const worldVertexArray: VertexInstance[] = new Array<VertexInstance>(3);
      for (let v: number = 0; v < 3; v++) {
        const vertex: VertexDefinition = vertexArray[v];
        const originToPoint: Vector3D = new Vector3D({
          type: 'points',
          pointA: position,
          pointB: vertex.getCoordinates(),
        });
        const magnitude: number = originToPoint.getMagnitude();
        if (magnitude > radius) {
          radius = magnitude;
        }
        let instance = vertexInstanceHashtable.get(vertex);
        if (!instance) {
          instance = new VertexInstance({
            type: 'world',
            worldCoordinates: Array.from(vertex.getCoordinates()),
            colourIndex: vertex.colourIndex,
          });
          vertexInstanceHashtable.set(vertex, instance);
        }
        worldVertexArray[v] = instance;
      }
      polygonInstanceArray[p] = new PolygonInstance(
        worldVertexArray,
        polygon.getColor()
      );
    }
    const vertexInstanceArray = Array.from(vertexInstanceHashtable.values());
    return new ModelInstance(
      polygonInstanceArray,
      vertexInstanceArray,
      position,
      radius
    );
  }
}
