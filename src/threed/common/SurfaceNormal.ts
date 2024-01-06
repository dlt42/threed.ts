import { Normal, Surface } from './common.types';

export default class SurfaceNormal implements Normal {
  public x = 0;
  public y = 0;
  public z = 0;
  public magnitude = 0;

  constructor(
    input:
      | { type: 'surface'; surface: Surface }
      | { type: 'copy'; normal: Normal }
  ) {
    if (input.type === 'copy') {
      const {
        normal: { magnitude, x, y, z },
      } = input;
      this.magnitude = magnitude;
      this.x = x;
      this.y = y;
      this.z = z;
    } else {
      this.calculate(input.surface);
    }
  }

  public copy() {
    return new SurfaceNormal({ type: 'copy', normal: this });
  }

  public calculate(surface: Surface) {
    const [coordinates0, coordinates1, coordinates2] = surface;
    let x1 = coordinates2[0] - coordinates0[0];
    let y1 = coordinates2[1] - coordinates0[1];
    let z1 = coordinates2[2] - coordinates0[2];
    let x2 = coordinates1[0] - coordinates0[0];
    let y2 = coordinates1[1] - coordinates0[1];
    let z2 = coordinates1[2] - coordinates0[2];
    const magnitude1 = 1 / Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1);
    x1 *= magnitude1;
    y1 *= magnitude1;
    z1 *= magnitude1;
    const magnitude2 = 1 / Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
    x2 *= magnitude2;
    y2 *= magnitude2;
    z2 *= magnitude2;
    const x3 = y1 * z2 - z1 * y2;
    const y3 = z1 * x2 - x1 * z2;
    const z3 = x1 * y2 - y1 * x2;
    this.magnitude = 1 / Math.sqrt(x3 * x3 + y3 * y3 + z3 * z3);
    this.x = x3 * this.magnitude;
    this.y = y3 * this.magnitude;
    this.z = z3 * this.magnitude;
  }
}
