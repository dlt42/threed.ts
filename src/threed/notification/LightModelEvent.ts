import LightModel from '../lighting/LightModel';

export default class LightModelEvent {
  private source: LightModel;

  public constructor(source: LightModel) {
    this.source = source;
  }

  public getSource(): LightModel {
    return this.source;
  }
}
