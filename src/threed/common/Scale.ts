import Matrix from './Matrix';

export default class Scale {
  public x: number;
  public y: number;
  public z: number;

  public constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public getScaleMatrix(): Matrix {
    return Matrix.getScaleMatrix(this);
  }

  public set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
