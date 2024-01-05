import LightSourceEvent from '../notification/LightSourceEvent';
import LightSourceListener from '../notification/LightSourceListener';

export default class LightSource {
  public positionX: number;
  public positionY: number;
  public positionZ: number;
  private listeners: LightSourceListener[];

  public constructor(position: number[]) {
    this.positionX = position[0];
    this.positionY = position[1];
    this.positionZ = position[2];
    this.listeners = [];
  }

  public addListener(listener: LightSourceListener) {
    this.listeners.push(listener);
  }

  public getPosition(): number[] {
    return [this.positionX, this.positionY, this.positionZ];
  }

  public removeListener(listener: LightSourceListener) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
      return true;
    }
    return false;
  }

  public setPosition(position: number[]) {
    this.positionX = position[0];
    this.positionY = position[1];
    this.positionZ = position[2];
    const event: LightSourceEvent = new LightSourceEvent(this);
    for (let i: number = 0; i < this.listeners.length; i++)
      this.listeners[i].notify(event);
  }
}
