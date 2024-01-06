import { Coords } from '../common/common.types';
import PolygonInstance from '../objectinstance/PolygonInstance';

export default class ClipPlane {
  public normal0: number;
  public normal1: number;
  public normal2: number;
  public point: Coords;

  public constructor(pointA: Coords, pointB: Coords, pointC: Coords) {
    this.point = pointB;
    const array: number[] = PolygonInstance.calculateNormal(
      pointA,
      pointB,
      pointC
    );
    this.normal0 = array[0];
    this.normal1 = array[1];
    this.normal2 = array[2];
  }
}
