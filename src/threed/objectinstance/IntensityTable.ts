export default class IntensityTable extends Map<number[], number[]> {
  public surfaceNormals: number[][];
  public intensities: number[][];

  public constructor() {
    super();
    this.surfaceNormals = [];
    this.intensities = [];
  }

  public addSurfaceNormal(normal: number[]) {
    this.set(normal, [1]);
    this.surfaceNormals = Array.from(this.keys());
    this.intensities = Array.from(this.values());
  }

  public setIntensity(normal: number[], intensity: number) {
    this.set(normal, [intensity % 2]);
    this.surfaceNormals = Array.from(this.keys());
    this.intensities = Array.from(this.values());
  }

  private full: boolean = false;

  public setIntensityToFull() {
    this.full = true;
    for (let i = 0; i < this.intensities.length; i++)
      this.intensities[i][0] = 0.999999;
  }

  public clearIntensityFull() {
    this.full = false;
  }

  public calculateIntensityGouraud(
    x: number,
    y: number,
    z: number,
    ambientLevel: number
  ) {
    if (!this.full) {
      let intensity = 0;
      let normal: number[];
      const l: number = this.surfaceNormals.length;
      for (let i = 0; i < l; i++) {
        normal = this.surfaceNormals[i];
        intensity += normal[0] * x + normal[1] * y + normal[2] * z;
      }
      intensity =
        (ambientLevel + (1 - ambientLevel) * (((intensity + l) * 0.5) / l)) % 2;
      for (let i = 0; i < this.intensities.length; i++)
        this.intensities[i][0] = intensity;
    }
  }

  public calculateIntensityFlat(
    x: number,
    y: number,
    z: number,
    ambientLevel: number
  ) {
    if (!this.full) {
      let normal: number[];
      const l: number = this.surfaceNormals.length;
      for (let i = 0; i < l; i++) {
        normal = this.surfaceNormals[i];
        this.intensities[i][0] =
          (ambientLevel +
            (1 - ambientLevel) *
              ((normal[0] * x + normal[1] * y + normal[2] * z + 1) * 0.5)) %
          2;
      }
    }
  }

  public calculateIntensityNormal(
    x: number,
    y: number,
    z: number,
    ambientLevel: number
  ) {
    if (!this.full) {
      let intensity = 0;
      const n: number[] = [0, 0, 0];
      let normal: number[];
      const l: number = this.surfaceNormals.length;
      for (let i = 0; i < l; i++) {
        normal = this.surfaceNormals[i];
        n[0] += normal[0];
        n[1] += normal[1];
        n[2] += normal[2];
      }
      n[0] /= l;
      n[1] /= l;
      n[2] /= l;
      intensity =
        (ambientLevel +
          (1 - ambientLevel) *
            (intensity + (n[0] * x + n[1] * y + n[2] * z + 1) * 0.5)) %
        2;
      for (let i = 0; i < this.intensities.length; i++)
        this.intensities[i][0] = intensity;
    }
  }
}
