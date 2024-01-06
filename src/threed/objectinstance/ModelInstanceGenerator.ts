import { Coords } from '../common/common.types';
import Vector3D from '../common/Vector3D';
import ModelDefinition from '../objectdefinition/ModelDefinition';
import PolygonDefinition from '../objectdefinition/PolygonDefinition';
import VertexDefinition from '../objectdefinition/VertexDefinition';
import ModelInstance from './ModelInstance';
import PolygonInstance from './PolygonInstance';
import VertexInstance from './VertexInstance';

export default class ModelInstanceGenerator {
  public generateInstance(model: ModelDefinition) {
    let radius = 0;
    const polygonDefinitionArray: PolygonDefinition[] = model.getPolygons();
    const polygonInstanceArray: PolygonInstance[] = new Array<PolygonInstance>(
      polygonDefinitionArray.length
    );
    const vertexInstanceHashtable: Map<VertexDefinition, VertexInstance> =
      new Map<VertexDefinition, VertexInstance>();
    const position: Coords = [0, 0, 0];
    for (let p = 0; p < polygonDefinitionArray.length; p++) {
      const polygon: PolygonDefinition = polygonDefinitionArray[p];
      const vertexArray: VertexDefinition[] = polygon.getVertices();
      const worldVertexArray: VertexInstance[] = new Array<VertexInstance>(3);
      for (let v = 0; v < 3; v++) {
        const vertex: VertexDefinition = vertexArray[v];
        const originToPoint: Vector3D = new Vector3D({
          type: 'points',
          pointA: position,
          pointB: vertex.getCoords(),
        });
        const magnitude = originToPoint.getMagnitude();
        if (magnitude > radius) {
          radius = magnitude;
        }
        let instance = vertexInstanceHashtable.get(vertex);
        if (!instance) {
          instance = new VertexInstance({
            type: 'world',
            worldCoords: vertex.getCoords().slice(0) as Coords,
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
