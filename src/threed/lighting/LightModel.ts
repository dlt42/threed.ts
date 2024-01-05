import LightModelEvent from '../notification/LightModelEvent';
import LightModelListener from '../notification/LightModelListener';
import LightSourceListener from '../notification/LightSourceListener';
import IntensityTable from '../objectinstance/IntensityTable';
import LightSource from './LightSource';

export default abstract class LightModel implements LightSourceListener {
  protected ambientLevel: number;

  private listeners: Array<LightModelListener>;

  protected lightSource: LightSource;

  public constructor(lightSource: LightSource, ambientLevel: number) {
    this.ambientLevel = ambientLevel;
    this.lightSource = lightSource;
    this.listeners = [];
    lightSource.addListener(this);
  }

  public addListener(listener: LightModelListener) {
    this.listeners.push(listener);
  }

  public abstract calculateIntensity(
    worldCoordinates: number[],
    intensityTable: IntensityTable
  ): void;

  public getAmbientLevel(): number {
    return this.ambientLevel;
  }

  public notify() {
    const modelEvent: LightModelEvent = new LightModelEvent(this);
    for (let i = 0; i < this.listeners.length; i++)
      this.listeners[i].notify(modelEvent);
  }

  public removeListener(listener: LightModelListener) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
      return true;
    }
    return false;
  }

  public setAmbientLevel(ambientLevel: number) {
    this.ambientLevel = ambientLevel;
    const event: LightModelEvent = new LightModelEvent(this);
    for (let i = 0; i < this.listeners.length; i++)
      this.listeners[i].notify(event);
  }
}
