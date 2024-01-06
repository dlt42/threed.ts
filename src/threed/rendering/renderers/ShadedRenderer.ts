import { Coords } from '../../common/common.types';
import PolygonInstance from '../../objectinstance/PolygonInstance';
import Renderer from './Renderer';

export default class ShadedRenderer extends Renderer {
  static twoFiveFour = 254.0;

  plot(
    pointA: Coords,
    pointB: Coords,
    pointC: Coords,
    i1: number,
    i2: number,
    i3: number
  ) {
    if (!this.zBuffer) {
      throw Error('No zbuffer');
    }
    let oh, dxl, dxr, zl, zr, cl, cr, b1y, b2y, c1y, c2y, xstr, xend;
    const colors = this.converter.colors;
    const zvalues = this.zBuffer.zvalues;

    let x1 = pointA[0];
    const y1 = pointA[1];
    let z1 = pointA[2];

    let x2 = pointB[0];
    const y2 = pointB[1];
    let z2 = pointB[2];

    let x3 = pointC[0];
    const y3 = pointC[1];
    let z3 = pointC[2];

    if (y1 === y2) {
      if (x2 < x1) {
        const tx = x2;
        const tz = z2;
        const ti = i2;
        x2 = x1;
        z2 = z1;
        i2 = i1;
        x1 = tx;
        z1 = tz;
        i1 = ti;
      }
      oh = 1 / (y3 - y1);
      dxl = (x3 - x1) * oh;
      dxr = (x3 - x2) * oh;
      zl = z1;
      zr = z2;
      cl = i1;
      cr = i2;
      b1y = (z3 - z1) * oh;
      b2y = (z3 - z2) * oh;
      c1y = (i3 - i1) * oh;
      c2y = (i3 - i2) * oh;
      xstr = x1;
      xend = x2;
    } else {
      if (x3 < x2) {
        const tx = x2;
        const tz = z2;
        const ti = i2;
        x2 = x3;
        z2 = z3;
        i2 = i3;
        x3 = tx;
        z3 = tz;
        i3 = ti;
      }
      oh = 1 / (y3 - y1);
      dxl = (x2 - x1) * oh;
      dxr = (x3 - x1) * oh;
      zl = z1;
      zr = z1;
      cl = i1;
      cr = i1;
      b1y = (z2 - z1) * oh;
      b2y = (z3 - z1) * oh;
      c1y = (i2 - i1) * oh;
      c2y = (i3 - i1) * oh;
      xstr = x1;
      xend = x1;
    }
    let line = ((y1 | 0) + this.halfHeight - 1) * this.fullWidth;
    xstr += this.halfWidth;
    xend += this.halfWidth;
    for (
      let yi = y1;
      yi <= y3;
      yi++, xstr += dxl, xend += dxr, zl += b1y, zr += b2y, cl += c1y, cr += c2y
    ) {
      let zm = zl;
      let cm = cl;
      const t = 1.0 / (1.0 + xend - xstr);
      const bx = (zr - zl) * t;
      const cx = (cr - cl) * t;
      line += this.fullWidth;
      if (yi > -this.halfHeight && yi < this.halfHeight) {
        let cur = line + (xstr | 0);
        for (
          let xi = xstr | 0;
          xi <= (xend | 0);
          xi++, zm += bx, cm += cx, cur++
        ) {
          if (zm < zvalues[cur] && xi > 0 && xi < this.fullWidth) {
            zvalues[cur | 0] = zm;
            this.dataBuffer?.data.set(
              colors[(ShadedRenderer.twoFiveFour * cm) | 0].rgba,
              cur * 4
            );
          }
        }
      }
    }
  }

  public renderPolygon(polygon: PolygonInstance) {
    if (polygon != null && polygon.vertexArray.length >= 3) {
      const v = polygon.vertexArray;
      const l = v.length;
      const s = polygon.surfaceNormal;

      for (let i = 0; i < l - 2; i++) {
        let pointA = v[0].screenCoords;
        let pointB = v[i + 1].screenCoords;
        let pointC = v[i + 2].screenCoords;

        const vertA = v[0].get(s);
        const vertB = v[i + 1].get(s);
        const vertC = v[i + 2].get(s);
        if (!vertA || !vertB || !vertC) {
          throw Error('Invalid state');
        }
        let iA = vertA[0];
        let iB = vertB[0];
        let iC = vertC[0];

        this.converter.setColor(polygon.color);

        if (pointB[1] < pointA[1]) {
          const pointT = pointB;
          const iT = iB;
          pointB = pointA;
          iB = iA;
          pointA = pointT;
          iA = iT;
        }
        if (pointC[1] < pointA[1]) {
          const pointT = pointC;
          const iT = iC;
          pointC = pointA;
          iC = iA;
          pointA = pointT;
          iA = iT;
        }
        if (pointC[1] < pointB[1]) {
          const pointT = pointC;
          const iT = iC;
          pointC = pointB;
          iC = iB;
          pointB = pointT;
          iB = iT;
        }
        if (
          pointA[1] === pointB[1] ||
          pointA[1] === pointC[1] ||
          pointB[1] === pointC[1]
        ) {
          this.plot(pointA, pointB, pointC, iA, iB, iC);
        } else {
          const multiplier = (pointB[1] - pointA[1]) / (pointC[1] - pointA[1]);
          const pointN: Coords = [
            pointA[0] + (pointC[0] - pointA[0]) * multiplier,
            pointB[1],
            pointA[2] + (pointC[2] - pointA[2]) * multiplier,
          ];
          const newi = iA + (iC - iA) * multiplier;
          this.plot(pointA, pointN, pointB, iA, newi, iB);
          this.plot(pointB, pointN, pointC, iB, newi, iC);
        }
      }
    }
  }

  setColor() {}
}
