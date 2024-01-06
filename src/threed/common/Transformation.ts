import { TransformationType, TransformationValues } from './common.types';
import Matrix from './Matrix';

abstract class TransformationBase {
  public transformation: TransformationValues;
  public type: TransformationType;

  public constructor(
    transformation: TransformationValues,
    type: TransformationType
  ) {
    this.type = type;
    this.transformation = this.checkValues(transformation);
  }

  public set(transformation: TransformationValues) {
    this.transformation = this.checkValues(transformation);
  }

  public abstract getMatrix(): Matrix;

  public abstract copy(): Transformation;

  public adj(transformation: TransformationValues) {
    this.transformation = this.checkValues({
      x: this.transformation.x + transformation.x,
      y: this.transformation.y + transformation.y,
      z: this.transformation.z + transformation.z,
    });
  }

  private checkValues(transformation: TransformationValues) {
    return {
      x: this.checkValue(transformation.x),
      y: this.checkValue(transformation.y),
      z: this.checkValue(transformation.z),
    };
  }

  protected checkValue(value: number) {
    return value;
  }
}

export class Scale extends TransformationBase {
  public constructor(transformation: TransformationValues) {
    super(transformation, 'scale');
  }

  public copy() {
    return new Scale(this.transformation);
  }

  public getMatrix() {
    return Matrix.getScaleMatrix(this);
  }
}

export class Translation extends TransformationBase {
  public constructor(transformation: TransformationValues) {
    super(transformation, 'translation');
  }

  public copy() {
    return new Translation(this.transformation);
  }

  public getMatrix() {
    return Matrix.getTranslationMatrixForTranslation(this);
  }
}

export class Rotation extends TransformationBase {
  public constructor(transformation: TransformationValues) {
    super(transformation, 'rotation');
  }

  public copy() {
    return new Rotation(this.transformation);
  }

  public getMatrix() {
    return Matrix.getRotationMatrix(this);
  }

  protected checkValue(angle: number) {
    angle = angle % 360;
    if (angle < 0) angle = 359 + angle;
    return angle;
  }
}

export type Transformation = Scale | Translation | Rotation;
