import Matrix from '../common/Matrix';
import Rotation from '../common/Rotation';
import ViewPointEvent from '../notification/ViewPointEvent';
import ViewPointListener from '../notification/ViewPointListener';

export default class ViewPoint {
  private position: number[];

  private orientation: Rotation;

  private listeners: Array<ViewPointListener>;

  public constructor(position: number[], orientation: Rotation) {
    this.position = position;
    this.orientation = orientation;
    this.listeners = [];
  }

  public addListener(listener: ViewPointListener) {
    this.listeners.push(listener);
  }

  public getOrientation(): Rotation {
    return this.orientation.copy();
  }

  public getPosition(): number[] {
    return this.position.slice(0);
  }

  public getViewTransformationMatrix(): Matrix {
    return Matrix.multiplyMatrices(
      Matrix.getTranslationMatrix([
        -this.position[0],
        -this.position[1],
        -this.position[2],
      ]),
      Matrix.getRotationMatrix(this.orientation)
    );
  }

  public removeListener(listener: ViewPointListener) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  public setOrientation(orientation: Rotation) {
    this.orientation = orientation;
  }

  public setOrientationWithNotify(orientation: Rotation) {
    this.orientation = orientation;
    const event: ViewPointEvent = new ViewPointEvent(this);
    this.listeners.forEach((current) => current.notify(event));
  }

  public setPosition(position: number[]) {
    this.position = position;
    const event: ViewPointEvent = new ViewPointEvent(this);
    this.listeners.forEach((current) => current.notify(event));
  }

  public adjPosition(position: number[]) {
    this.position[0] += position[0];
    this.position[1] += position[1];
    this.position[2] += position[2];
    const event: ViewPointEvent = new ViewPointEvent(this);
    this.listeners.forEach((current) => current.notify(event));
  }
}
