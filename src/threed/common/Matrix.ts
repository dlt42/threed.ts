import { Coords, MatrixValues } from './common.types';
import { Rotation, Scale, Translation } from './Transformation';
import TrigTables from './TrigTables';

export default class Matrix {
  public static orderSwitch: boolean = true;
  private static rotationX: Matrix[] = Matrix.calcRotationXMatrices();
  private static rotationY: Matrix[] = Matrix.calcRotationYMatrices();
  private static rotationZ: Matrix[] = Matrix.calcRotationZMatrices();

  private static calcRotationXMatrices() {
    const rotationArray: Matrix[] = new Array<Matrix>(3600);
    for (let angle = 0; angle < 3600; angle++) {
      const rotationMatrix: Matrix = new Matrix();
      rotationMatrix.values[1][1] = TrigTables.cosValues[angle];
      rotationMatrix.values[1][2] = TrigTables.sinValues[angle];
      rotationMatrix.values[2][1] = -TrigTables.sinValues[angle];
      rotationMatrix.values[2][2] = TrigTables.cosValues[angle];
      rotationArray[angle] = rotationMatrix;
    }
    return rotationArray;
  }

  private static calcRotationYMatrices() {
    const rotationArray: Matrix[] = new Array<Matrix>(3600);
    for (let angle = 0; angle < 3600; angle++) {
      const rotationMatrix: Matrix = new Matrix();
      rotationMatrix.values[0][0] = TrigTables.cosValues[angle];
      rotationMatrix.values[0][2] = -TrigTables.sinValues[angle];
      rotationMatrix.values[2][0] = TrigTables.sinValues[angle];
      rotationMatrix.values[2][2] = TrigTables.cosValues[angle];
      rotationArray[angle] = rotationMatrix;
    }
    return rotationArray;
  }

  private static calcRotationZMatrices() {
    const rotationArray: Matrix[] = new Array<Matrix>(3600);
    for (let angle = 0; angle < 3600; angle++) {
      const rotationMatrix: Matrix = new Matrix();
      rotationMatrix.values[0][0] = TrigTables.cosValues[angle];
      rotationMatrix.values[0][1] = TrigTables.sinValues[angle];
      rotationMatrix.values[1][0] = -TrigTables.sinValues[angle];
      rotationMatrix.values[1][1] = TrigTables.cosValues[angle];
      rotationArray[angle] = rotationMatrix;
    }
    return rotationArray;
  }

  public static getRotationMatrix({ transformation }: Rotation) {
    const angleX = transformation.x;
    const angleY = transformation.y;
    const angleZ = transformation.z;
    let rotationMatrix: Matrix | null = null;
    if (Matrix.orderSwitch) {
      if (angleY != 0) rotationMatrix = Matrix.rotationY[angleY * 10.0];
      if (angleX != 0)
        rotationMatrix = !rotationMatrix
          ? Matrix.rotationX[angleX * 10]
          : Matrix.multiplyMatrices(
              rotationMatrix,
              Matrix.rotationX[angleX * 10]
            );
    } else {
      if (angleX != 0) rotationMatrix = Matrix.rotationX[angleX * 10];
      if (angleY != 0)
        rotationMatrix = !rotationMatrix
          ? Matrix.rotationY[angleY * 10.0]
          : Matrix.multiplyMatrices(
              rotationMatrix,
              Matrix.rotationY[angleY * 10]
            );
    }
    if (angleZ != 0)
      rotationMatrix = !rotationMatrix
        ? Matrix.rotationZ[angleZ * 10.0]
        : Matrix.multiplyMatrices(
            rotationMatrix,
            Matrix.rotationZ[angleZ * 10]
          );
    if (!rotationMatrix) rotationMatrix = new Matrix();
    return rotationMatrix;
  }

  public static getScaleMatrix({ transformation }: Scale) {
    const scaleMatrix: Matrix = new Matrix();
    scaleMatrix.values[0][0] = transformation.x;
    scaleMatrix.values[1][1] = transformation.y;
    scaleMatrix.values[2][2] = transformation.z;
    return scaleMatrix;
  }

  public static getTranslationMatrix(coordinates: Coords) {
    const translationMatrix: Matrix = new Matrix();
    translationMatrix.values[3] = [
      coordinates[0],
      coordinates[1],
      coordinates[2],
      translationMatrix.values[3][3],
    ];
    return translationMatrix;
  }

  public static getTranslationMatrixForValues(x: number, y: number, z: number) {
    const translationMatrix: Matrix = new Matrix();
    translationMatrix.values[3] = [x, y, z, translationMatrix.values[3][3]];
    return translationMatrix;
  }

  public static getRotateModelAroundPoint(point: Coords, rotation: Rotation) {
    return Matrix.multiplyMatrices(
      Matrix.multiplyMatrices(
        Matrix.getTranslationMatrixForValues(-point[0], -point[1], -point[2]),
        Matrix.getRotationMatrix(rotation)
      ),
      Matrix.getTranslationMatrix(point)
    );
  }

  public static getTranslationMatrixForTranslation({
    transformation,
  }: Translation) {
    const translationMatrix: Matrix = new Matrix();
    translationMatrix.values[3] = [
      transformation.x,
      transformation.y,
      transformation.z,
      translationMatrix.values[3][3],
    ];
    return translationMatrix;
  }

  public static multiplyMatrices(matA: Matrix, matB: Matrix) {
    const matrixNew = new Matrix();
    for (let ii = 0; ii < 4; ii++)
      for (let ij = 0; ij < 4; ij++)
        matrixNew.values[ii][ij] =
          matA.values[ii][0] * matB.values[0][ij] +
          matA.values[ii][1] * matB.values[1][ij] +
          matA.values[ii][2] * matB.values[2][ij] +
          matA.values[ii][3] * matB.values[3][ij];
    return matrixNew;
  }

  public static multiplyValues(values: MatrixValues, mat: Matrix) {
    const matrixNew: Matrix = new Matrix();
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        matrixNew.values[i][j] =
          values[i][0] * mat.values[0][j] +
          values[i][1] * mat.values[1][j] +
          values[i][2] * mat.values[2][j] +
          values[i][3] * mat.values[3][j];
    return matrixNew;
  }

  public values: MatrixValues;

  public constructor() {
    this.values = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  }

  public transform(srcCoords: Coords, destCoords: Coords) {
    for (let i = 0; i < 3; i++)
      destCoords[i] =
        srcCoords[0] * this.values[0][i] +
        srcCoords[1] * this.values[1][i] +
        srcCoords[2] * this.values[2][i] +
        this.values[3][i];
  }

  public transformCoords(coords: Coords) {
    const orig = coords.slice(0);
    for (let i = 0; i < 3; i++)
      coords[i] =
        (orig[0] * 100.0 * this.values[0][i]) / 100.0 +
        (orig[1] * 100.0 * this.values[1][i]) / 100.0 +
        (orig[2] * 100.0 * this.values[2][i]) / 100.0 +
        this.values[3][i];
  }
}
