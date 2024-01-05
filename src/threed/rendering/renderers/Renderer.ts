import ScreenAreaEvent from '../../notification/ScreenAreaEvent';
import ScreenAreaListener from '../../notification/ScreenAreaListener';
import ModelInstance from '../../objectinstance/ModelInstance';
import PolygonInstance from '../../objectinstance/PolygonInstance';
import World from '../../world/World';
import ColourConverter from '../ColourConverter';
import ScreenArea from '../ScreenArea';
import ViewVolume from '../ViewVolume';
import ZBuffer from '../ZBuffer';

export default abstract class Renderer implements ScreenAreaListener {
  protected zBuffer: ZBuffer | null = null;
  protected dataBuffer: ImageData | null = null;
  protected converter: ColourConverter;
  protected screenArea: ScreenArea;
  protected fullWidth: number = 0;
  protected halfWidth: number = 0;
  protected fullHeight: number = 0;
  protected halfHeight: number = 0;
  protected world: World | null = null;
  protected viewVolume: ViewVolume | null = null;
  protected count: number = 0;

  public constructor(screenArea: ScreenArea, converter: ColourConverter) {
    this.screenArea = screenArea;
    this.setScreenArea(screenArea);
    this.converter = converter;
  }

  protected getScreenHeight(): number {
    return this.fullHeight;
  }

  protected getScreenWidth(): number {
    return this.fullWidth;
  }

  public notify(event: ScreenAreaEvent): void {
    if (event.getId() === ScreenAreaEvent.RESIZED) {
      this.fullWidth = event.getWidth();
      this.fullHeight = event.getHeight();
      this.halfWidth = (this.fullWidth / 2) | 0;
      this.halfHeight = (this.fullHeight / 2) | 0;
    }
    if (event.getId() === ScreenAreaEvent.RESIZED) this.defineZBuffer();
    else if (event.getId() === ScreenAreaEvent.CLEARED && this.zBuffer)
      this.zBuffer.clearBuffer();
  }

  private defineZBuffer(): void {
    let tWidth: number = this.fullWidth;
    let tHeight: number = this.fullHeight;
    if (tWidth < 1) tWidth = 1;
    if (tHeight < 1) tHeight = 1;
    if (this.zBuffer === null) this.zBuffer = new ZBuffer(tWidth, tHeight);
    else this.zBuffer.setDimensions(tWidth, tHeight);
  }

  public setObjects(world: World | null, viewVolume: ViewVolume | null): void {
    this.world = world;
    this.viewVolume = viewVolume;
  }

  public async render(...args: unknown[]): Promise<void> {
    switch (args.length) {
      case 0: {
        this.count = 1;
        try {
          this.start();
          this.dataBuffer = this.screenArea
            ? await this.screenArea.getDataBuffer()
            : null;
          for (const model of this.world
            ? this.world.objectArray
            : ([] as ModelInstance[])) {
            if (model.enabled) {
              let i = 0;
              const polygons = model.polygonArray;
              const length = polygons.length;
              if (this.viewVolume) {
                switch (this.viewVolume.objectTrivialReject(model)) {
                  case ViewVolume.ACCEPT:
                    do {
                      const polygon = polygons[i];
                      if (!polygon.culled) {
                        this.viewVolume.transferToScreenSpace(polygon);
                        this.renderPolygon(polygon);
                      }
                    } while (++i < length);
                    break;
                  case ViewVolume.PARTIAL:
                    do {
                      const polygon = polygons[i];
                      if (!polygon.culled) {
                        const clippedPoly =
                          this.viewVolume.rejectAndClip(polygon);
                        if (clippedPoly) this.renderPolygon(clippedPoly);
                      }
                    } while (++i < length);
                    break;
                  default:
                    break;
                }
              }
            }
          }
          this.stop();
        } catch (e) {
          console.log(e);
        }
        break;
      }
      case 2: {
        const [world, viewVolume] = args as [World, ViewVolume];
        this.world = world;
        this.viewVolume = viewVolume;
        this.render();
        break;
      }
      default: {
        throw Error(`Invalid number of arguments`);
      }
    }
  }

  private startVal: number = 0;

  protected start(): void {
    this.startVal = new Date().getTime();
  }

  protected stop(): void {
    const duration: number = new Date().getTime() - this.startVal;
    console.log(duration + ' milliseconds (' + duration / 1000 + ')');
  }

  protected abstract renderPolygon(polygon: PolygonInstance): void;

  public setColourConverter(colourConverter: ColourConverter): void {
    this.converter = colourConverter;
  }

  public setScreenArea(screenArea: ScreenArea): void {
    if (screenArea !== null) screenArea.removeListener(this);
    this.screenArea = screenArea;
    this.screenArea.addListener(this);
  }
}
