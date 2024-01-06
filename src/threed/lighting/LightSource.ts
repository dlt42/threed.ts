import { Coords } from '../common/common.types';
import { LightSourceEvent } from '../notification/Event';
import { LightSourceListener } from '../notification/Listeners';

export default class LightSource {
  public position: Coords;
  private listeners: LightSourceListener[];

  public constructor(position: Coords) {
    this.position = position.slice(0) as Coords;
    this.listeners = [];
  }

  public addListener(listener: LightSourceListener) {
    this.listeners.push(listener);
  }

  public getPosition() {
    return this.position.slice(0) as Coords;
  }

  public removeListener(listener: LightSourceListener) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) this.listeners.splice(index, 1);
  }

  public setPosition(position: Coords) {
    this.position = position.slice(0) as Coords;
    const event = new LightSourceEvent(this);
    this.listeners.forEach((current) => current.notify(event));
  }
}
