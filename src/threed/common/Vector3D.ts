import { Coords } from './common.types';

export default class Vector3D {
  public static crossProduct(vectorA: Vector3D, vectorB: Vector3D) {
    return new Vector3D({
      type: 'coords',
      coords: [
        vectorA.y * vectorB.z - vectorA.z * vectorB.y,
        vectorA.z * vectorB.x - vectorA.x * vectorB.z,
        vectorA.x * vectorB.y - vectorA.y * vectorB.x,
      ],
    });
  }

  private static dotProductCoords({
    vectorA,
    x,
    y,
    z,
  }: {
    vectorA: Vector3D;
    x: number;
    y: number;
    z: number;
  }) {
    return vectorA.x * x + vectorA.y * y + vectorA.z * z;
  }

  private static dotProductVectors({
    vectorA,
    vectorB,
  }: {
    vectorA: Vector3D;
    vectorB: Vector3D;
  }) {
    return (
      vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z
    );
  }

  public static dotProduct(
    args:
      | { type: 'coords'; vectorA: Vector3D; x: number; y: number; z: number }
      | { type: 'vectors'; vectorA: Vector3D; vectorB: Vector3D }
  ) {
    if (args.type === 'coords') {
      return Vector3D.dotProductCoords(args);
    } else {
      return Vector3D.dotProductVectors(args);
    }
  }

  public x: number;
  public y: number;
  public z: number;

  public constructor(
    args:
      | { type: 'points'; pointA: Coords; pointB: Coords }
      | { type: 'coords'; coords: Coords }
  ) {
    switch (args.type) {
      case 'points': {
        const { pointA, pointB } = args;
        this.x = pointB[0] - pointA[0];
        this.y = pointB[1] - pointA[1];
        this.z = pointB[2] - pointA[2];
        break;
      }
      case 'coords': {
        const [x, y, z] = args.coords;
        this.x = x;
        this.y = y;
        this.z = z;
        break;
      }
    }
  }

  public getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  public normalise() {
    const magnitude: number =
      1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x = this.x * magnitude;
    this.y = this.y * magnitude;
    this.z = this.z * magnitude;
  }

  private setPoints({ pointA, pointB }: { pointA: Coords; pointB: Coords }) {
    this.x = pointB[0] - pointA[0];
    this.y = pointB[1] - pointA[1];
    this.z = pointB[2] - pointA[2];
  }

  private setDirect({ x, y, z }: { x: number; y: number; z: number }) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public set(
    args:
      | { type: 'points'; pointA: Coords; pointB: Coords }
      | {
          type: 'direct';
          x: number;
          y: number;
          z: number;
        }
  ) {
    if (args.type === 'direct') this.setDirect(args);
    else this.setPoints(args);
  }
}
