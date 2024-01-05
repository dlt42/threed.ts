import LightSource from '../lighting/LightSource';

export default class LightSourceEvent {
  private source: LightSource;

  public constructor(source: LightSource) {
    this.source = source;
  }

  public getSource(): LightSource {
    return this.source;
  }
}
