import { Coords, MatrixRow, MatrixValues } from './common.types';
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
      const values = rotationMatrix.values;
      values[1][1] = TrigTables.cosValues[angle];
      values[1][2] = TrigTables.sinValues[angle];
      values[2][1] = -TrigTables.sinValues[angle];
      values[2][2] = TrigTables.cosValues[angle];
      rotationArray[angle] = rotationMatrix;
    }
    return rotationArray;
  }

  private static calcRotationYMatrices() {
    const rotationArray: Matrix[] = new Array<Matrix>(3600);
    for (let angle = 0; angle < 3600; angle++) {
      const rotationMatrix: Matrix = new Matrix();
      const values = rotationMatrix.values;
      values[0][0] = TrigTables.cosValues[angle];
      values[0][2] = -TrigTables.sinValues[angle];
      values[2][0] = TrigTables.sinValues[angle];
      values[2][2] = TrigTables.cosValues[angle];
      rotationArray[angle] = rotationMatrix;
    }
    return rotationArray;
  }

  private static calcRotationZMatrices() {
    const rotationArray: Matrix[] = new Array<Matrix>(3600);
    for (let angle = 0; angle < 3600; angle++) {
      const rotationMatrix: Matrix = new Matrix();
      const values = rotationMatrix.values;
      values[0][0] = TrigTables.cosValues[angle];
      values[0][1] = TrigTables.sinValues[angle];
      values[1][0] = -TrigTables.sinValues[angle];
      values[1][1] = TrigTables.cosValues[angle];
      rotationMatrix.values = values;
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
    const values = scaleMatrix.values;
    values[0][0] = transformation.x;
    values[1][1] = transformation.y;
    values[2][2] = transformation.z;
    scaleMatrix.values = values;
    return scaleMatrix;
  }

  public static getTranslationMatrix(coordinates: Coords) {
    const translationMatrix: Matrix = new Matrix();
    const values = translationMatrix.values;
    values[3][0] = coordinates[0];
    values[3][1] = coordinates[1];
    values[3][2] = coordinates[2];
    translationMatrix.values = values;
    return translationMatrix;
  }

  public static getTranslationMatrixForValues(x: number, y: number, z: number) {
    const translationMatrix: Matrix = new Matrix();
    const values = translationMatrix.values;
    values[3][0] = x;
    values[3][1] = y;
    values[3][2] = z;
    translationMatrix.values = values;
    return translationMatrix;
  }

  public static getRotateModelAroundPoint(point: Coords, rotation: Rotation) {
    const translateToOrigin: Matrix = Matrix.getTranslationMatrixForValues(
      -point[0],
      -point[1],
      -point[2]
    );
    const rotate: Matrix = Matrix.getRotationMatrix(rotation);
    const translateToPosition: Matrix = Matrix.getTranslationMatrix(point);
    const transformMatrix: Matrix = Matrix.multiplyMatrices(
      translateToOrigin,
      rotate
    );
    return Matrix.multiplyMatrices(transformMatrix, translateToPosition);
  }

  public static getTranslationMatrixForTranslation({
    transformation,
  }: Translation) {
    const translationMatrix: Matrix = new Matrix();
    const values = translationMatrix.values;
    values[3][0] = transformation.x;
    values[3][1] = transformation.y;
    values[3][2] = transformation.z;
    translationMatrix.values = values;
    return translationMatrix;
  }

  public static multiplyMatrices(matA: Matrix, matB: Matrix) {
    const matrixNew = new Matrix();
    const valuesNew2 = matrixNew.values;
    for (let ii = 0; ii < 4; ii++) {
      for (let ij = 0; ij < 4; ij++) {
        valuesNew2[ii][ij] =
          matA.values[ii][0] * matB.values[0][ij] +
          matA.values[ii][1] * matB.values[1][ij] +
          matA.values[ii][2] * matB.values[2][ij] +
          matA.values[ii][3] * matB.values[3][ij];
      }
    }
    matrixNew.values = valuesNew2;
    return matrixNew;
  }

  public static multiplyValues(values: MatrixValues, mat: Matrix) {
    const matrixNew: Matrix = new Matrix();
    const valuesNew = matrixNew.values;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        valuesNew[i][j] =
          values[i][0] * mat.values[0][j] +
          values[i][1] * mat.values[1][j] +
          values[i][2] * mat.values[2][j] +
          values[i][3] * mat.values[3][j];
      }
    }
    matrixNew.values = valuesNew;
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
    const valuesOriginal: MatrixRow = [
      srcCoords[0],
      srcCoords[1],
      srcCoords[2],
      1,
    ];
    const valuesNew = [];
    for (let i = 0; i < 4; i++) {
      valuesNew[i] =
        valuesOriginal[0] * this.values[0][i] +
        valuesOriginal[1] * this.values[1][i] +
        valuesOriginal[2] * this.values[2][i] +
        valuesOriginal[3] * this.values[3][i];
    }
    destCoords[0] = valuesNew[0];
    destCoords[1] = valuesNew[1];
    destCoords[2] = valuesNew[2];
  }

  public transformCoords(coords: Coords) {
    const valuesNew: MatrixRow = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      valuesNew[i] =
        coords[0] * this.values[0][i] +
        coords[1] * this.values[1][i] +
        coords[2] * this.values[2][i] +
        this.values[3][i];
    }
    coords[0] = valuesNew[0];
    coords[1] = valuesNew[1];
    coords[2] = valuesNew[2];
  }
}