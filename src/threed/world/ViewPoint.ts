import { Coords } from '../common/common.types';
import Matrix from '../common/Matrix';
import { Rotation } from '../common/Transformation';
import { ViewPointEvent } from '../notification/Event';
import { ViewPointListener } from '../notification/Listeners';

export default class ViewPoint {
  private position: Coords;
  private orientation: Rotation;
  private listeners: Array<ViewPointListener>;

  public constructor(position: Coords, orientation: Rotation) {
    this.position = position;
    this.orientation = orientation;
    this.listeners = [];
  }

  public addListener(listener: ViewPointListener) {
    this.listeners.push(listener);
  }

  public getOrientation() {
    return this.orientation.copy();
  }

  public getPosition() {
    return this.position.slice(0) as Coords;
  }

  public getViewTransformationMatrix() {
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
    if (index >= 0) this.listeners.splice(index, 1);
  }

  public setOrientation(orientation: Rotation) {
    this.orientation = orientation;
  }

  public setOrientationWithNotify(orientation: Rotation) {
    this.orientation = orientation;
    const event = new ViewPointEvent(this);
    this.listeners.forEach((current) => current.notify(event));
  }

  public setPosition(position: Coords) {
    this.position = position;
    const event = new ViewPointEvent(this);
    this.listeners.forEach((current) => current.notify(event));
  }

  public adjPosition(position: Coords) {
    this.position[0] += position[0];
    this.position[1] += position[1];
    this.position[2] += position[2];
    const event = new ViewPointEvent(this);
    this.listeners.forEach((current) => current.notify(event));
  }
}
