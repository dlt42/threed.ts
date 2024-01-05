export default class ZBuffer {
  public zvalues: Array<number>;

  public constructor(width: number, height: number) {
    this.zvalues = new Array<number>((width + 1) * (height + 1));
    this.clearBuffer();
  }

  public clearBuffer(): void {
    this.zvalues.fill(1.0);
  }

  public setDimensions(width: number, height: number): void {
    this.zvalues = new Array<number>((width + 1) * (height + 1));
    this.clearBuffer();
  }
}
