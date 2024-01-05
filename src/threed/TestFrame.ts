import LightModel from './lighting/LightModel';
import LightSource from './lighting/LightSource';
import Renderer from './rendering/renderers/Renderer';
import ScreenArea from './rendering/ScreenArea';
import ViewVolume from './rendering/ViewVolume';
import ViewPoint from './world/ViewPoint';
import World from './world/World';

export default abstract class TestFrame {
  protected screenArea: ScreenArea | null = null;
  protected lastX: number = 0;
  protected lastY: number = 0;
  protected world: World | null = null;
  protected lightModel: LightModel | null = null;
  protected lightSource: LightSource | null = null;
  protected viewPoint: ViewPoint | null = null;
  protected renderer: Renderer | null = null;
  protected viewVolume: ViewVolume | null = null;

  public constructor(canvas: HTMLCanvasElement) {
    this.initialise(canvas);
  }

  public abstract addModels(): void;

  public abstract createScene(): void;

  public getScreenArea(): ScreenArea | null {
    return this.screenArea;
  }

  private initialise(canvas: HTMLCanvasElement): void {
    this.screenArea = new ScreenArea(600, 600, canvas);
    this.lastX = 200;
    this.lastY = 200;
  }

  public abstract renderScene(): void;
}
