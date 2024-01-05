import Matrix from '../common/Matrix';
import Rotation from '../common/Rotation';
import Scale from '../common/Scale';
import Translation from '../common/Translation';
import LightModel from '../lighting/LightModel';
import LightSource from '../lighting/LightSource';
import LightModelEvent from '../notification/LightModelEvent';
import LightModelListener from '../notification/LightModelListener';
import ModelInstanceListener from '../notification/ModelInstanceListener';
import ViewPointEvent from '../notification/ViewPointEvent';
import ViewPointListener from '../notification/ViewPointListener';
import ModelInstance from '../objectinstance/ModelInstance';
import ViewPoint from './ViewPoint';

export default class World
  implements LightModelListener, ViewPointListener, ModelInstanceListener
{
  public objectArray: Array<ModelInstance>;
  private lightChanged: boolean = false;
  private viewPositionChanged: boolean;
  private lightModel: LightModel;
  private viewPoint: ViewPoint;
  private backfaceCull: boolean;
  private intensityCalculate: boolean;

  public constructor(lightModel: LightModel, viewPoint: ViewPoint) {
    this.objectArray = [];
    this.lightModel = lightModel;
    this.setLightModel(lightModel);
    this.backfaceCull = true;
    this.intensityCalculate = true;
    this.viewPoint =
      viewPoint || new ViewPoint([0, 0, 0], new Rotation(0, 0, 0));
    this.viewPositionChanged = true;
    this.viewPoint.addListener(this);
  }

  public addModel(model: ModelInstance) {
    this.notifyModelInstance(model);
    model.addListener(this);
    this.objectArray.push(model);
  }

  private calculateCulled() {
    if (this.backfaceCull)
      this.objectArray.forEach((current) =>
        current.calculateCulled(this.viewPoint.getPosition())
      );
    else this.objectArray.forEach((current) => current.setCulledStatusFalse());
    this.viewPositionChanged = false;
  }

  private calculateIntensity() {
    if (this.intensityCalculate && this.lightModel != null)
      this.objectArray.forEach((current) => {
        current.clearIntensityLocked();
        this.calulateIntensity(current);
      });
    else
      this.objectArray.forEach((current) => {
        current.setIntensityToFull();
      });
    this.lightChanged = false;
  }

  private calulateIntensity(model: ModelInstance) {
    if (!model.intensityLocked)
      model.vertexArray.forEach((current) =>
        this.lightModel.calculateIntensity(current.worldCoordinates, current)
      );
  }

  public getViewPoint(): ViewPoint {
    return this.viewPoint;
  }

  public notify(event: LightModelEvent | ViewPointEvent | ModelInstance) {
    if (event instanceof LightModelEvent) this.lightChanged = true;
    else if (event instanceof ViewPointEvent) this.viewPositionChanged = true;
    else if (event instanceof ModelInstance) this.notifyModelInstance(event);
  }

  private prepareForRendering() {
    if (this.viewPositionChanged && this.backfaceCull) this.calculateCulled();
    if (this.lightChanged && this.intensityCalculate && this.lightModel != null)
      this.calculateIntensity();
  }

  public notifyModelInstance(model: ModelInstance) {
    if (!this.viewPositionChanged) {
      if (this.backfaceCull)
        model.calculateCulled(this.viewPoint.getPosition());
      else model.setCulledStatusFalse();
    }
    if (!this.lightChanged) {
      if (this.intensityCalculate && this.lightModel != null)
        this.calulateIntensity(model);
      else model.setIntensityToFull();
    }
  }

  public removeModel(model: ModelInstance) {
    const index = this.objectArray.indexOf(model);
    if (index >= 0) {
      model.removeListener(this);
      this.objectArray.splice(index, 1);
    }
  }

  public removeModels() {
    this.objectArray.forEach((current) => current.removeListener(this));
    this.objectArray = [];
  }

  public rotateLightSourceAroundPoint(
    light: LightSource,
    point: number[],
    rotation: Rotation
  ) {
    const translateToOrigin: Matrix = Matrix.getTranslationMatrix([
      -point[0],
      -point[1],
      -point[2],
    ]);
    const rotate: Matrix = Matrix.getRotationMatrix(rotation);
    const translateToPosition: Matrix = Matrix.getTranslationMatrix(point);
    let transformMatrix: Matrix = Matrix.multiplyMatrices(
      translateToOrigin,
      rotate
    );
    transformMatrix = Matrix.multiplyMatrices(
      transformMatrix,
      translateToPosition
    );
    const coords: number[] = light.getPosition();
    transformMatrix.transformCoords(coords);
    light.setPosition(coords);
  }

  public rotateModelAroundPoint(
    model: ModelInstance,
    point: number[],
    rotation: Rotation
  ) {
    model.transformWorld(Matrix.getRotateModelAroundPoint(point, rotation));
  }

  public getRotateModelAroundPoint(
    point: number[],
    rotation: Rotation
  ): Matrix {
    return Matrix.multiplyMatrices(
      Matrix.multiplyMatrices(
        Matrix.getTranslationMatrixForValues(-point[0], -point[1], -point[2]),
        Matrix.getRotationMatrix(rotation)
      ),
      Matrix.getTranslationMatrix(point)
    );
  }

  public setLightModel(lightModel: LightModel) {
    if (this.lightModel != null) this.lightModel.removeListener(this);
    this.lightModel = lightModel;
    if (this.lightModel != null) this.lightModel.addListener(this);
    this.lightChanged = true;
  }

  public switchBackfaceCull(state: boolean) {
    if (state !== this.backfaceCull) {
      this.backfaceCull = state;
      this.calculateCulled();
    }
  }

  public switchIntensityCalculate(state: boolean) {
    if (state !== this.intensityCalculate) {
      this.intensityCalculate = state;
      this.calculateIntensity();
    }
  }

  public transferObjectsToViewSpace() {
    this.prepareForRendering();
    const toViewMatrix = this.viewPoint.getViewTransformationMatrix();
    this.objectArray
      .slice(0)
      .forEach((current) => current.transformToView(toViewMatrix));
  }

  public transformModel(
    model: ModelInstance,
    tranform: Rotation | Scale | Translation
  ) {
    if (tranform instanceof Rotation)
      model.transformWorld(Matrix.getRotationMatrix(tranform));
    else if (tranform instanceof Scale)
      model.transformWorld(Matrix.getScaleMatrix(tranform));
    else if (tranform instanceof Translation)
      model.transformWorld(Matrix.getTranslationMatrixForTranslation(tranform));
  }
}
