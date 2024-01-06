import LightModel from '../lighting/LightModel';
import LightSource from '../lighting/LightSource';
import ScreenArea from '../rendering/ScreenArea';
import ViewPoint from '../world/ViewPoint';

abstract class EventBase<T> {
  protected source: T;

  public constructor(source: T) {
    this.source = source;
  }

  public getSource() {
    return this.source;
  }
}

export class LightModelEvent extends EventBase<LightModel> {}

export class LightSourceEvent extends EventBase<LightSource> {}

export class ViewPointEvent extends EventBase<ViewPoint> {}

export class ScreenAreaEvent extends EventBase<ScreenArea> {
  public static RESIZED = 0;
  public static CLEARED = 1;
  private width: number;
  private height: number;
  private id: number;

  public constructor(
    source: ScreenArea,
    width: number,
    height: number,
    id: number
  ) {
    super(source);
    this.height = height;
    this.width = width;
    this.id = id;
  }

  public getHeight() {
    return this.height;
  }
  public getId() {
    return this.id;
  }

  public getWidth() {
    return this.width;
  }
}
