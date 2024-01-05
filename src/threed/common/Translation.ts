import Matrix from './Matrix';

export default class Translation {
  public x: number;
  public y: number;
  public z: number;

  public constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public getTranslationMatrix(): Matrix {
    return Matrix.getTranslationMatrixForTranslation(this);
  }

  public set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
