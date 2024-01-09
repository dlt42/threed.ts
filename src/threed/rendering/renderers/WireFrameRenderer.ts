import Color from '../../common/Color';
import PolygonInstance from '../../objectinstance/PolygonInstance';
import Renderer from './Renderer';

export default class WireFrameRenderer extends Renderer {
  public drawLine(xs: number, ys: number, xe: number, ye: number) {
    if (!this.dataBuffer) return;
    xs = xs | 0;
    ys = ys | 0;
    xe = xe | 0;
    ye = ye | 0;
    const color: Color = Color.WHITE;
    if (ys === ye) {
      if (ys > 0 && ys < this.fullHeight) {
        const line = (ys - 1) * this.fullWidth;
        if (xe < xs) {
          const tx = xs;
          xs = xe;
          xe = tx;
        }
        for (let x = xs; x < xe; x++) {
          if (x > 0 && x < this.fullWidth)
            this.dataBuffer.data.set(color.rgba, (line + x) * 4);
        }
      }
    } else {
      if (ye < ys) {
        const tx = xs;
        const ty = ys;
        xs = xe;
        ys = ye;
        xe = tx;
        ye = ty;
      }
      const dx = (xe - xs) / (ye - ys);
      let xi = xs;
      for (let y = ys | 0; y < (ye | 0); y++) {
        if (y > 0 && y < this.fullHeight) {
          const line = (y - 1) * this.fullWidth;
          if (dx < 0) {
            for (let x = (xi + dx) | 0; x <= (xi | 0); x++)
              if (x > 0 && x < this.fullWidth)
                this.dataBuffer.data.set(color.rgba, (line + x) * 4);
          } else {
            for (let x = xi | 0; x <= ((xi + dx) | 0); x++)
              if (x > 0 && x < this.fullWidth)
                this.dataBuffer.data.set(color.rgba, (line + x) * 4);
          }
        }
        xi += dx;
      }
    }
  }

  public renderPolygon(polygon: PolygonInstance) {
    if (polygon != null) {
      for (let i = 0; i < polygon.vertexArray.length; i++) {
        this.drawLine(
          polygon.vertexArray[i].screenCoords[0] + this.fullWidth / 2,
          polygon.vertexArray[i].screenCoords[1] + this.fullHeight / 2,
          polygon.vertexArray[(i + 1) % polygon.vertexArray.length]
            .screenCoords[0] +
            this.fullWidth / 2,
          polygon.vertexArray[(i + 1) % polygon.vertexArray.length]
            .screenCoords[1] +
            this.fullHeight / 2
        );
      }
    }
  }
}
