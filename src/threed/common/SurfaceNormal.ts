type SurfaceNormalInput =
  | {
      type: 'coordinates';
      value: number[][];
    }
  | {
      type: 'copy';
      value: SurfaceNormal;
    };

export default class SurfaceNormal {
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;
  public magnitudeD: number = 0;

  constructor(input: SurfaceNormalInput) {
    if (input.type === 'copy') {
      this.magnitudeD = input.value.magnitudeD;
      this.x = input.value.x;
      this.y = input.value.y;
      this.z = input.value.z;
    } else {
      this.calculate(input.value[0], input.value[1], input.value[2]);
    }
  }

  public copy(): SurfaceNormal {
    return new SurfaceNormal({ type: 'copy', value: this });
  }

  public calculate(
    coordinates0: number[],
    coordinates1: number[],
    coordinates2: number[]
  ) {
    let x1 = coordinates2[0] - coordinates0[0];
    let y1 = coordinates2[1] - coordinates0[1];
    let z1 = coordinates2[2] - coordinates0[2];
    let x2 = coordinates1[0] - coordinates0[0];
    let y2 = coordinates1[1] - coordinates0[1];
    let z2 = coordinates1[2] - coordinates0[2];
    const magnitudeD1 = 1 / Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1);
    x1 *= magnitudeD1;
    y1 *= magnitudeD1;
    z1 *= magnitudeD1;
    const magnitudeD2 = 1 / Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
    x2 *= magnitudeD2;
    y2 *= magnitudeD2;
    z2 *= magnitudeD2;
    const x3 = y1 * z2 - z1 * y2;
    const y3 = z1 * x2 - x1 * z2;
    const z3 = x1 * y2 - y1 * x2;
    this.magnitudeD = 1 / Math.sqrt(x3 * x3 + y3 * y3 + z3 * z3);
    this.x = x3 * this.magnitudeD;
    this.y = y3 * this.magnitudeD;
    this.z = z3 * this.magnitudeD;
  }
}
