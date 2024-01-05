export default class Color {
  public rgba: number[] = [0, 0, 0, 255];

  public static BLUE: Color = new Color([0, 0, 255, 255]);
  public static RED: Color = new Color([255, 0, 0, 255]);
  public static GREEN: Color = new Color([0, 255, 0, 255]);
  public static BLACK: Color = new Color([0, 0, 0, 255]);
  public static WHITE: Color = new Color([255, 255, 255, 255]);
  public static GRAY: Color = new Color([127, 127, 127, 255]);

  constructor(rgba: number[]) {
    this.rgba = rgba;
  }
}
