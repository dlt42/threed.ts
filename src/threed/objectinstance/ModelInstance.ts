import Color from '../common/Color';
import Matrix from '../common/Matrix';
import Translation from '../common/Translation';
import ModelInstanceListener from '../notification/ModelInstanceListener';
import PolygonInstance from './PolygonInstance';
import VertexInstance from './VertexInstance';

export default class ModelInstance {
  public polygonArray: PolygonInstance[];
  public vertexArray: VertexInstance[];
  private viewCoordinates: number[][];
  private worldCoordinates: number[][];
  private worldPosition: number[];
  public viewPosition: number[];
  public boundingRadius: number;
  private listeners: Array<ModelInstanceListener>;
  public intensityLocked: boolean;
  public enabled: boolean;

  public constructor(
    polygons: PolygonInstance[],
    vertices: VertexInstance[],
    worldPosition: number[],
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
    this.viewCoordinates = [];
    this.worldCoordinates = [];
    for (let i: number = 0; i < this.vertexArray.length; i++) {
      this.viewCoordinates[i] = this.vertexArray[i].viewCoordinates;
      this.worldCoordinates[i] = this.vertexArray[i].worldCoordinates;
    }
  }

  public setEnabled(): void {
    this.enabled = true;
  }

  public setDisabled(): void {
    this.enabled = false;
  }

  public addListener(listener: ModelInstanceListener): void {
    this.listeners.push(listener);
  }

  public calculateCulled(viewPosition: number[]) {
    for (let index = 0; index < this.polygonArray.length; index++) {
      const element = this.polygonArray[index];
      element.culled =
        element.surfaceNormal[0] *
          (viewPosition[0] - element.vertexArray[0].worldCoordinates[0]) +
          element.surfaceNormal[1] *
            (viewPosition[1] - element.vertexArray[0].worldCoordinates[1]) +
          element.surfaceNormal[2] *
            (viewPosition[2] - element.vertexArray[0].worldCoordinates[2]) >
        0;
    }
  }

  public centreOnOrigin() {
    const initialCoordinates: number[] =
      this.polygonArray[0].vertexArray[0].worldCoordinates;
    let maxX: number = initialCoordinates[0];
    let maxY: number = initialCoordinates[1];
    let maxZ: number = initialCoordinates[2];
    let minX: number = initialCoordinates[0];
    let minY: number = initialCoordinates[1];
    let minZ: number = initialCoordinates[2];
    for (let index = 0; index < this.polygonArray.length; index++) {
      const polygon = this.polygonArray[index];
      const vertexArray: VertexInstance[] = polygon.vertexArray;
      for (let v: number = 0; v < 3; v++) {
        const vertex: VertexInstance = vertexArray[v];
        const localCoordinates: number[] = vertex.worldCoordinates;
        const x: number = localCoordinates[0];
        const y: number = localCoordinates[1];
        const z: number = localCoordinates[2];
        if (x < minX) minX = x;
        else if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        else if (y > maxY) maxY = y;
        if (z < minZ) minZ = z;
        else if (z > maxZ) maxZ = z;
      }
    }
    const centreX: number = (maxX - minX) / 2 + minX;
    const centreY: number = (maxY - minY) / 2 + minY;
    const centreZ: number = (maxZ - minZ) / 2 + minZ;
    const translate: Matrix = Matrix.getTranslationMatrixForTranslation(
      new Translation(-centreX, -centreY, -centreZ)
    );
    this.transformWorld(translate);
  }

  public getWorldPosition(): number[] {
    return this.worldPosition.slice(0);
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

  public setWorldPosition(pos: number[]) {
    this.transformWorld(
      Matrix.getTranslationMatrix([
        -(this.worldPosition[0] - pos[0]),
        -(this.worldPosition[1] - pos[1]),
        -(this.worldPosition[2] - pos[2]),
      ])
    );
  }

  public transformToView(matrix: Matrix) {
    for (let i = 0; i < this.viewCoordinates.length; i++)
      matrix.transform(this.worldCoordinates[i], this.viewCoordinates[i]);
    matrix.transform(this.worldPosition, this.viewPosition);
  }

  public transformWorld(matrix: Matrix) {
    for (let i = 0; i < this.worldCoordinates.length; i++)
      matrix.transformCoords(this.worldCoordinates[i]);
    for (let i = 0; i < this.polygonArray.length; i++)
      this.polygonArray[i].calculateNormal();
    matrix.transformCoords(this.worldPosition);
    for (let index = 0; index < this.listeners.length; index++)
      this.listeners[index].notify(this);
  }
}
