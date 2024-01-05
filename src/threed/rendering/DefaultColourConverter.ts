import Color from '../common/Color';
import ColourConverter from './ColourConverter';

export default class DefaultColourConverter extends ColourConverter {
  private static readonly colorTable: Map<Color, Color[]> = new Map<
    Color,
    Color[]
  >();

  private static readonly hsbs: Map<Color, number[]> = new Map<
    Color,
    number[]
  >();

  static colDiv: number = 1.0 / 255.0;

  public getColour(intensity: number, color?: Color): Color {
    if (color !== undefined) {
      let hsb: number[];
      if (DefaultColourConverter.hsbs.has(color)) {
        hsb = DefaultColourConverter.hsbs.get(color) || [];
      } else {
        hsb = RGBtoHSV(color.rgba[0], color.rgba[1], color.rgba[2]);
        DefaultColourConverter.hsbs.set(color, hsb);
      }
      return new Color(HSVtoRGB(hsb[0], hsb[1], intensity * hsb[2]));
    } else {
      return this.colors[254.0 * intensity];
    }
  }

  public setColor(color: Color) {
    if (DefaultColourConverter.colorTable.has(color)) {
      this.colors = DefaultColourConverter.colorTable.get(color) || [];
    } else {
      let hsb: number[] = [0, 0, 0];
      hsb = RGBtoHSV(color.rgba[0], color.rgba[1], color.rgba[2]);
      this.colors = [];
      for (let i: number = 1; i < 255; i++)
        this.colors[i - 1] = new Color(
          HSVtoRGB(hsb[0], hsb[1], DefaultColourConverter.colDiv * i * hsb[2])
        );

      DefaultColourConverter.colorTable.set(color, this.colors);
    }
  }

  public processColorIndex(_: number, index: number): number {
    return index;
  }

  public isRangeLimit(): boolean {
    return false;
  }
}

function HSVtoRGB(h: number, s: number, v: number): number[] {
  let r: number = 0;
  let g: number = 0;
  let b: number = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 255];
}

function RGBtoHSV(r: number, g: number, b: number): number[] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max / 255;
  switch (max) {
    case min:
      h = 0;
      break;
    case r:
      h = g - b + d * (g < b ? 6 : 0);
      h /= 6 * d;
      break;
    case g:
      h = b - r + d * 2;
      h /= 6 * d;
      break;
    case b:
      h = r - g + d * 4;
      h /= 6 * d;
      break;
  }
  return [h, s, v];
}
