import ScreenAreaEvent from '../notification/ScreenAreaEvent';
import ScreenAreaListener from '../notification/ScreenAreaListener';
import ModelInstance from '../objectinstance/ModelInstance';
import PolygonInstance from '../objectinstance/PolygonInstance';
import VertexInstance from '../objectinstance/VertexInstance';
import ClipPlane from './ClipPlane';

export default class ViewVolume implements ScreenAreaListener {
  public static readonly REJECT: number = 0;
  public static readonly PARTIAL: number = 1;
  public static readonly ACCEPT: number = 2;
  private nearPlaneDepth: number = 100;
  private viewPlaneDepth: number = 400;
  private farPlaneDepth: number = 100000;
  private clipPlanes: ClipPlane[];
  private NearTimesFar: number = 0;
  private FarMinusNear: number = 0;
  private NTFOverFMN: number = 0;

  public constructor(nearPlaneDepth: number, farPlaneDepth: number) {
    this.clipPlanes = new Array<ClipPlane>(6);
    this.setNearPlaneDepth(nearPlaneDepth);
    this.setFarPlaneDepth(farPlaneDepth);
    this.generateSideClipPlanes();
  }

  private clipPolygon(polygon: PolygonInstance): PolygonInstance | null {
    const surfaceNormal = polygon.surfaceNormal;
    const tempVertices: VertexInstance[] = [];
    let newVertices = polygon.vertexArray.slice(0);
    let count: number;
    for (const clipPlane of this.clipPlanes) {
      count = 0;
      for (let i = 0; i < newVertices.length; i++) {
        const vertexB = newVertices[(i + 1) % newVertices.length];
        const vertexA = newVertices[i];
        const cA = vertexA.viewCoordinates;
        const cB = vertexB.viewCoordinates;
        const cP = clipPlane.point;
        const dc1 =
          (cA[0] - cP[0]) * clipPlane.normal0 +
          (cA[1] - cP[1]) * clipPlane.normal1 +
          (cA[2] - cP[2]) * clipPlane.normal2;
        const dc2 =
          (cB[0] - cP[0]) * clipPlane.normal0 +
          (cB[1] - cP[1]) * clipPlane.normal1 +
          (cB[2] - cP[2]) * clipPlane.normal2;
        if (dc1 > 0 && dc2 > 0) {
          tempVertices[count] = vertexB;
          count++;
        } else if ((dc1 > 0 && dc2 <= 0) || (dc1 <= 0 && dc2 > 0)) {
          const t =
            ((cP[0] - cA[0]) * clipPlane.normal0 +
              (cP[1] - cA[1]) * clipPlane.normal1 +
              (cP[2] - cA[2]) * clipPlane.normal2) /
            ((cB[0] - cA[0]) * clipPlane.normal0 +
              (cB[1] - cA[1]) * clipPlane.normal1 +
              (cB[2] - cA[2]) * clipPlane.normal2);
          const xC = [
            cA[0] + t * (cB[0] - cA[0]),
            cA[1] + t * (cB[1] - cA[1]),
            cA[2] + t * (cB[2] - cA[2]),
          ];
          const mC = vertexA.getIntersectingPoint(vertexB, t);
          const vertA = vertexA.get(surfaceNormal);
          const vertB = vertexB.get(surfaceNormal);
          if (!vertA || !vertB) {
            throw Error('?');
          }
          const xI = vertA && vertB ? vertA[0] + t * (vertB[0] - vertA[0]) : 0;
          const ci =
            vertexA.colourIndex +
            t * (vertexB.colourIndex - vertexA.colourIndex);
          tempVertices[count] = new VertexInstance({
            colourIndex: ci,
            normal: surfaceNormal,
            modelCoordinates: mC,
            viewCoordinates: xC,
            type: 'model',
            intensity: xI,
          });
          count++;
          if (dc1 <= 0) {
            tempVertices[count] = vertexB;
            count++;
          }
        }
      }
      newVertices = tempVertices.slice(0);
    }

    return newVertices.length >= 3
      ? new PolygonInstance(newVertices, polygon.color, surfaceNormal)
      : null;
  }

  private generateSideClipPlanes(): void {
    this.clipPlanes[0] = new ClipPlane(
      [0, 0, 0],
      [-this.nearPlaneDepth, -this.nearPlaneDepth, this.nearPlaneDepth],
      [-this.nearPlaneDepth, this.nearPlaneDepth, this.nearPlaneDepth]
    );
    this.clipPlanes[1] = new ClipPlane(
      [0, 0, 0],
      [this.nearPlaneDepth, this.nearPlaneDepth, this.nearPlaneDepth],
      [this.nearPlaneDepth, -this.nearPlaneDepth, this.nearPlaneDepth]
    );
    this.clipPlanes[2] = new ClipPlane(
      [0, 0, 0],
      [-this.nearPlaneDepth, this.nearPlaneDepth, this.nearPlaneDepth],
      [this.nearPlaneDepth, this.nearPlaneDepth, this.nearPlaneDepth]
    );
    this.clipPlanes[3] = new ClipPlane(
      [0, 0, 0],
      [this.nearPlaneDepth, -this.nearPlaneDepth, this.nearPlaneDepth],
      [-this.nearPlaneDepth, -this.nearPlaneDepth, this.nearPlaneDepth]
    );
  }

  public notify(event: ScreenAreaEvent): void {
    if (event.getId() === ScreenAreaEvent.RESIZED) {
      const width = event.getWidth();
      const height = event.getHeight();
      this.viewPlaneDepth = width > height ? width / 2 : height / 2;
    }
  }

  public objectTrivialReject(model: ModelInstance): number {
    const radius = model.boundingRadius;
    const position = model.viewPosition;
    const x = position[0] <= 0.0 ? 0.0 - position[0] : position[0];
    const y = position[1] <= 0.0 ? 0.0 - position[1] : position[1];
    const z = position[2];
    const r = Math.sqrt(2 * (radius * radius));
    if (
      this.nearPlaneDepth < z - r &&
      this.farPlaneDepth > z + r &&
      z > x + r &&
      z > y + r
    )
      return ViewVolume.ACCEPT;
    if (
      this.nearPlaneDepth > z + r ||
      this.farPlaneDepth < z - r ||
      z < x - r ||
      z < y - r
    )
      return ViewVolume.REJECT;
    return ViewVolume.PARTIAL;
  }

  public rejectAndClip(polygon: PolygonInstance): PolygonInstance | null {
    const count: number[] = [0, 0, 0, 0, 0, 0];
    const sizeRC = polygon.vertexArray.length;
    for (let n = 0; n < sizeRC; n++) {
      const Vc = polygon.vertexArray[n].viewCoordinates;
      const Vz = Vc[2];
      if (Vz < 0) {
        if (this.nearPlaneDepth > -Vz) count[0]++;
        if (this.farPlaneDepth < -Vz) count[1]++;
        if (-Vz < Vc[0]) count[2]++;
        if (Vz > Vc[0]) count[3]++;
        if (-Vz < Vc[1]) count[4]++;
        if (Vz > Vc[1]) count[5]++;
      } else {
        if (this.nearPlaneDepth > Vz) count[0]++;
        if (this.farPlaneDepth < Vz) count[1]++;
        if (Vz < Vc[0]) count[2]++;
        if (-Vz > Vc[0]) count[3]++;
        if (Vz < Vc[1]) count[4]++;
        if (-Vz > Vc[1]) count[5]++;
      }
    }

    for (let n = 0; n < 6; n++) if (count[n] === sizeRC) return null;
    const tempPolygon = this.clipPolygon(polygon);
    if (tempPolygon !== null) this.transferToScreenSpace(tempPolygon);
    return tempPolygon;
  }

  public setFarPlaneDepth(farPlaneDepth: number): void {
    this.farPlaneDepth = farPlaneDepth;
    this.clipPlanes[5] = new ClipPlane(
      [this.nearPlaneDepth, this.nearPlaneDepth, farPlaneDepth],
      [-this.nearPlaneDepth, this.nearPlaneDepth, farPlaneDepth],
      [-this.nearPlaneDepth, -this.nearPlaneDepth, farPlaneDepth]
    );

    this.FarMinusNear = farPlaneDepth - this.nearPlaneDepth;
    this.NearTimesFar = this.nearPlaneDepth * farPlaneDepth;
    this.NTFOverFMN = this.NearTimesFar / this.FarMinusNear;
  }

  public setNearPlaneDepth(nearPlaneDepth: number): void {
    this.nearPlaneDepth = nearPlaneDepth;
    this.clipPlanes[4] = new ClipPlane(
      [nearPlaneDepth, nearPlaneDepth, nearPlaneDepth],
      [nearPlaneDepth, -nearPlaneDepth, nearPlaneDepth],
      [-nearPlaneDepth, -nearPlaneDepth, nearPlaneDepth]
    );

    this.FarMinusNear = this.farPlaneDepth - nearPlaneDepth;
    this.NearTimesFar = nearPlaneDepth * this.farPlaneDepth;
    this.NTFOverFMN = this.NearTimesFar / this.FarMinusNear;
  }

  public transferToScreenSpace(polygon: PolygonInstance): void {
    for (let i = 0; i < polygon.vertexArray.length; i++) {
      const vi = polygon.vertexArray[i];
      let tz = 1.0 / vi.viewCoordinates[2];
      if (tz === 0) tz = 1.0 / 0.01;

      vi.screenCoordinates[0] =
        this.viewPlaneDepth * (vi.viewCoordinates[0] * tz);
      vi.screenCoordinates[1] = -(
        this.viewPlaneDepth *
        (vi.viewCoordinates[1] * tz)
      );
      vi.screenCoordinates[2] =
        (this.farPlaneDepth / tz / this.FarMinusNear - this.NTFOverFMN) * tz;
    }
  }
}
