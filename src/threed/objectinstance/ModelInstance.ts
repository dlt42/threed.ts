import Color from '../common/Color';
import { Coords } from '../common/common.types';
import Matrix from '../common/Matrix';
import { ModelInstanceListener } from '../notification/Listeners';
import PolygonInstance from './PolygonInstance';
import VertexInstance from './VertexInstance';

export default class ModelInstance {
  public polygonArray: PolygonInstance[];
  public vertexArray: VertexInstance[];
  private viewCoords: Coords[];
  private worldCoords: Coords[];
  private worldPosition: Coords;
  public viewPosition: Coords;
  public boundingRadius: number;
  private listeners: Array<ModelInstanceListener>;
  public intensityLocked: boolean;
  public enabled: boolean;

  public constructor(
    polygons: PolygonInstance[],
    vertices: VertexInstance[],
    worldPosition: Coords,
    boundingRadius: number
  ) {
    this.intensityLocked = false;
    this.enabled = true;
    this.polygonArray = polygons;
    this.vertexArray = vertices;
    this.worldPosition = worldPosition;
    this.boundingRadius = boundingRadius;
    this.viewPosition = [0, 0, 0];
    this.listeners = [];
    this.polygonArray.forEach((current) => current.calculateNormal());
    this.viewCoords = [];
    this.worldCoords = [];
    for (let i = 0; i < this.vertexArray.length; i++) {
      this.viewCoords[i] = this.vertexArray[i].viewCoords;
      this.worldCoords[i] = this.vertexArray[i].worldCoords;
    }
  }

  public setEnabled() {
    this.enabled = true;
  }

  public setDisabled() {
    this.enabled = false;
  }

  public addListener(listener: ModelInstanceListener) {
    this.listeners.push(listener);
  }

  public calculateCulled(viewPosition: Coords) {
    for (let index = 0; index < this.polygonArray.length; index++) {
      const element = this.polygonArray[index];
      element.culled =
        element.surfaceNormal[0] *
          (viewPosition[0] - element.vertexArray[0].worldCoords[0]) +
          element.surfaceNormal[1] *
            (viewPosition[1] - element.vertexArray[0].worldCoords[1]) +
          element.surfaceNormal[2] *
            (viewPosition[2] - element.vertexArray[0].worldCoords[2]) >
        0;
    }
  }

  public centreOnOrigin() {
    const initialCoords: Coords =
      this.polygonArray[0].vertexArray[0].worldCoords;
    let maxX = initialCoords[0];
    let maxY = initialCoords[1];
    let maxZ = initialCoords[2];
    let minX = initialCoords[0];
    let minY = initialCoords[1];
    let minZ = initialCoords[2];
    for (let index = 0; index < this.polygonArray.length; index++) {
      const polygon = this.polygonArray[index];
      const vertexArray: VertexInstance[] = polygon.vertexArray;
      for (let v = 0; v < 3; v++) {
        const vertex: VertexInstance = vertexArray[v];
        const localCoords: Coords = vertex.worldCoords;
        const x = localCoords[0];
        const y = localCoords[1];
        const z = localCoords[2];
        if (x < minX) minX = x;
        else if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        else if (y > maxY) maxY = y;
        if (z < minZ) minZ = z;
        else if (z > maxZ) maxZ = z;
      }
    }
    const centreX = (maxX - minX) / 2 + minX;
    const centreY = (maxY - minY) / 2 + minY;
    const centreZ = (maxZ - minZ) / 2 + minZ;
    const translate: Matrix = Matrix.getTranslationMatrixForValues(
      -centreX,
      -centreY,
      -centreZ
    );
    this.transformWorld(translate);
  }

  public getWorldPosition() {
    return this.worldPosition.slice(0) as Coords;
  }

  public modelChanged() {
    this.polygonArray.forEach((current) => current.calculateNormal());
    this.listeners.forEach((current) => current.notify(this));
  }

  public removeListener(listener: ModelInstanceListener) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) this.listeners.splice(index, 1);
  }

  public setColor(color: Color) {
    this.polygonArray.forEach((current) => {
      current.color = color;
    });
  }

  public setCulledStatusFalse() {
    this.polygonArray.forEach((current) => {
      current.culled = false;
    });
  }

  public clearIntensityLocked() {
    this.intensityLocked = false;
    this.vertexArray.forEach((current) => {
      current.clearIntensityFull();
    });
  }

  public setIntensityToFull() {
    this.intensityLocked = true;
    this.vertexArray.forEach((current) => {
      current.setIntensityToFull();
    });
  }

  public setWorldPosition(pos: Coords) {
    this.transformWorld(
      Matrix.getTranslationMatrix([
        -(this.worldPosition[0] - pos[0]),
        -(this.worldPosition[1] - pos[1]),
        -(this.worldPosition[2] - pos[2]),
      ])
    );
  }

  public transformToView(matrix: Matrix) {
    for (let i = 0; i < this.viewCoords.length; i++)
      matrix.transform(this.worldCoords[i], this.viewCoords[i]);
    matrix.transform(this.worldPosition, this.viewPosition);
  }

  public transformWorld(matrix: Matrix) {
    for (let i = 0; i < this.worldCoords.length; i++)
      matrix.transformCoords(this.worldCoords[i]);
    for (let i = 0; i < this.polygonArray.length; i++)
      this.polygonArray[i].calculateNormal();
    matrix.transformCoords(this.worldPosition);
    for (let index = 0; index < this.listeners.length; index++)
      this.listeners[index].notify(this);
  }
}
