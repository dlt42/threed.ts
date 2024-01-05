import Matrix from './Matrix';

export default class Rotation {
  public x: number;
  public y: number;
  public z: number;

  public constructor(x: number, y: number, z: number) {
    this.x = this.checkAngle(x);
    this.y = this.checkAngle(y);
    this.z = this.checkAngle(z);
  }

  private checkAngle(angle: number): number {
    angle = angle % 360;
    if (angle < 0) angle = 359 + angle;
    return angle;
  }

  public copy(): Rotation {
    return new Rotation(this.x, this.y, this.z);
  }

  public getRotationMatrix(): Matrix {
    return Matrix.getRotationMatrix(this);
  }

  public set(x: number, y: number, z: number) {
    this.x = this.checkAngle(x);
    this.y = this.checkAngle(y);
    this.z = this.checkAngle(z);
  }

  public adj(x: number, y: number, z: number) {
    this.x = this.checkAngle(this.x + x);
    this.y = this.checkAngle(this.y + y);
    this.z = this.checkAngle(this.z + z);
  }
}
