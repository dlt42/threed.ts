import { Coords } from '../common/common.types';
import { LightModelEvent } from '../notification/Event';
import {
  LightModelListener,
  LightSourceListener,
} from '../notification/Listeners';
import { IntensityDetails } from '../objectinstance/instance.types';
import IntensityTable from '../objectinstance/IntensityTable';
import { LightModelType } from './lighting.types';
import LightSource from './LightSource';

export default class LightModel implements LightSourceListener {
  private x: number;
  private y: number;
  private z: number;
  private magnitude: number;
  private ambientLevel: number;
  private lightSource: LightSource;
  private listeners: Array<LightModelListener>;
  private type: LightModelType;

  public constructor(
    lightSource: LightSource,
    ambientLevel: number,
    type: LightModelType
  ) {
    this.ambientLevel = ambientLevel;
    this.lightSource = lightSource;
    this.type = type;
    this.listeners = [];
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.magnitude = 0;
    lightSource.addListener(this);
  }

  public addListener(listener: LightModelListener) {
    this.listeners.push(listener);
  }

  public getAmbientLevel() {
    return this.ambientLevel;
  }

  public notify() {
    const modelEvent = new LightModelEvent(this);
    this.listeners.forEach((current) => current.notify(modelEvent));
  }

  public removeListener(listener: LightModelListener) {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) this.listeners.splice(index, 1);
  }

  public setAmbientLevel(ambientLevel: number) {
    this.ambientLevel = ambientLevel;
    const event = new LightModelEvent(this);
    this.listeners.forEach((current) => current.notify(event));
  }

  public calculateIntensity(
    worldCoords: Coords,
    intensityTable: IntensityTable
  ) {
    this.x = worldCoords[0] - this.lightSource.position[0];
    this.y = worldCoords[1] - this.lightSource.position[1];
    this.z = worldCoords[2] - this.lightSource.position[2];
    this.magnitude =
      1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    const details: IntensityDetails = {
      x: this.x * this.magnitude,
      y: this.y * this.magnitude,
      z: this.z * this.magnitude,
      ambientLevel: this.ambientLevel,
    };
    switch (this.type) {
      case 'flat':
        intensityTable.calculateIntensityFlat(details);
        break;
      case 'gouraud':
        intensityTable.calculateIntensityGouraud(details);
        break;
      case 'normal':
        intensityTable.calculateIntensityNormal(details);
        break;
    }
  }
}
