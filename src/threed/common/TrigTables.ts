export default abstract class TrigTables {
  public static sinValues: number[] = TrigTables.calcSin();
  public static cosValues: number[] = TrigTables.calcCos();
  public static sinValues360: number[] = TrigTables.calcSin360();
  public static cosValues360: number[] = TrigTables.calcCos360();

  private static calcCos() {
    const cos: number[] = [];
    for (let angle = 0.0; angle < 3600.0; angle++)
      cos[angle] = Math.cos(this.toRadians(angle / 10));
    return cos;
  }

  private static calcCos360() {
    const cos: number[] = [];
    for (let angle = 0.0; angle < 360.0; angle++)
      cos[angle] = Math.cos(this.toRadians(angle));
    return cos;
  }

  private static calcSin() {
    const sin: number[] = [];
    for (let angle = 0.0; angle < 3600.0; angle++)
      sin[angle] = Math.sin(this.toRadians(angle / 10.0));
    return sin;
  }

  private static calcSin360() {
    const sin: number[] = [];
    for (let angle = 0.0; angle < 360.0; angle++)
      sin[angle] = Math.sin(this.toRadians(angle));
    return sin;
  }

  private static toRadians(angle: number) {
    return (angle * Math.PI) / 180;
  }

  private constructor() {}
}
