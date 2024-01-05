import ScreenArea from '../rendering/ScreenArea';

export default class ScreenAreaEvent {
  public static RESIZED: number = 0;
  public static CLEARED: number = 1;
  private width: number;
  private height: number;
  private source: ScreenArea;
  private id: number;

  public constructor(
    source: ScreenArea,
    width: number,
    height: number,
    id: number
  ) {
    this.height = height;
    this.width = width;
    this.source = source;
    this.id = id;
  }

  public getHeight(): number {
    return this.height;
  }
  public getId(): number {
    return this.id;
  }

  public getSource(): ScreenArea {
    return this.source;
  }

  public getWidth(): number {
    return this.width;
  }
}
