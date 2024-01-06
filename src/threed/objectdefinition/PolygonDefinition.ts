import Color from '../common/Color';
import VertexDefinition from './VertexDefinition';

export default class PolygonDefinition {
  private vertexArray: VertexDefinition[];

  public color: Color;

  public constructor(vertexArray: VertexDefinition[], color: Color) {
    this.vertexArray = vertexArray;
    this.color = color;
  }

  public getColor() {
    return this.color;
  }

  public getVertices() {
    return this.vertexArray;
  }
}
