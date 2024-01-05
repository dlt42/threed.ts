import ViewPoint from '../world/ViewPoint';

export default class ViewPointEvent {
  private source: ViewPoint;

  public constructor(source: ViewPoint) {
    this.source = source;
  }

  public getSource(): ViewPoint {
    return this.source;
  }
}
