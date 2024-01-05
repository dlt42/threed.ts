import Color from '../common/Color';

export default abstract class ColourConverter {
  public colors: Color[] = [];

  public abstract getColour(...args: unknown[]): Color;

  public abstract setColor(color: Color | null): void;

  public abstract processColorIndex(length: number, index: number): number;

  public abstract isRangeLimit(): boolean;
}
