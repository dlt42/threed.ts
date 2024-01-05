import IntensityTable from '../objectinstance/IntensityTable';
import LightModel from './LightModel';
import LightSource from './LightSource';

export default class GouraudShadedLightModel extends LightModel {
  private x: number;
  private y: number;
  private z: number;
  private magnitudeD: number;

  public constructor(light: LightSource, ambientLevel: number) {
    super(light, ambientLevel);
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.magnitudeD = 0;
  }

  public calculateIntensity(
    worldCoordinates: number[],
    intensityTable: IntensityTable
  ) {
    this.x = worldCoordinates[0] - this.lightSource.positionX;
    this.y = worldCoordinates[1] - this.lightSource.positionY;
    this.z = worldCoordinates[2] - this.lightSource.positionZ;
    this.magnitudeD =
      1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    intensityTable.calculateIntensityGouraud(
      this.x * this.magnitudeD,
      this.y * this.magnitudeD,
      this.z * this.magnitudeD,
      this.ambientLevel
    );
  }
}
