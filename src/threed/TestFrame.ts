import Color from './common/Color';
import { Rotation } from './common/Transformation';
import { LightModelType } from './lighting/lighting.types';
import LightModel from './lighting/LightModel';
import LightSource from './lighting/LightSource';
import ModelDefinition from './objectdefinition/ModelDefinition';
import ModelDefinitionGenerator from './objectdefinition/ModelDefinitionGenerator';
import ModelInstance from './objectinstance/ModelInstance';
import DefaultColourConverter from './rendering/DefaultColourConverter';
import Renderer from './rendering/renderers/Renderer';
import ShadedRenderer from './rendering/renderers/ShadedRenderer';
import WireFrameRenderer from './rendering/renderers/WireFrameRenderer';
import ScreenArea from './rendering/ScreenArea';
import ViewVolume from './rendering/ViewVolume';
import ViewPoint from './world/ViewPoint';
import World from './world/World';

export type RenderSceneArgs = {
  world: World;
  rotation: Rotation;
  objects: ModelInstance[];
};

export type RenderType = 'shaded' | 'wireframe';

export type TestType = 'translation' | 'perspective' | 'culling';
export type ModelType = 'cube' | 'sphere' | 'cylinder' | 'tube' | 'surface';

export type TestFrameParams = {
  canvas: HTMLCanvasElement;
  renderType: RenderType;
  lightModelType: LightModelType;
  modelType: ModelType;
};

export default abstract class TestFrame {
  private screenArea: ScreenArea | null = null;
  private lastX = 0;
  private lastY = 0;
  protected world: World | null = null;
  private lightModel: LightModel | null = null;
  private lightSource: LightSource | null = null;
  private viewPoint: ViewPoint | null = null;
  private renderer: Renderer | null = null;
  private viewVolume: ViewVolume | null = null;
  private renderType: RenderType;
  private lightModelType: LightModelType;
  private modelType: ModelType;

  private rotation: Rotation = new Rotation({ x: 0, y: 0, z: 0 });

  public constructor({
    canvas,
    lightModelType,
    renderType,
    modelType,
  }: TestFrameParams) {
    this.renderType = renderType;
    this.lightModelType = lightModelType;
    this.modelType = modelType;
    this.initialise(canvas);
  }

  public abstract addModels(): void;

  public getRotation() {
    return this.rotation;
  }

  public createScene() {
    this.viewPoint = new ViewPoint(
      [0, 0, 0],
      new Rotation({ x: 0, y: 0, z: 0 })
    );
    this.lightSource = new LightSource([0, 0, 0]);
    this.lightModel = new LightModel(
      this.lightSource,
      0.3,
      this.lightModelType
    );
    this.world = new World(this.lightModel, this.viewPoint);
    // this.world.switchBackfaceCull(false);
    const screenArea: ScreenArea | null = this.getScreenArea();
    if (!screenArea) throw Error('No Screen Area');
    this.renderer =
      this.renderType === 'shaded'
        ? new ShadedRenderer(screenArea, new DefaultColourConverter())
        : new WireFrameRenderer(screenArea, new DefaultColourConverter());
    screenArea?.getCanvas().addEventListener('mousemove', (e) => {
      const flags = e.buttons !== undefined ? e.buttons : e.which;
      if ((flags & 1) === 1) {
        this.mouseDragged(e.pageX, e.pageY);
      }
    });
    this.viewVolume = new ViewVolume(100, 10000);
    screenArea.addListener(this.viewVolume);
  }

  public mouseDragged(mouseX: number, mouseY: number) {
    let x = 0;
    let y = 0;
    if (mouseX > this.lastX) {
      y = 3;
    }
    if (mouseX < this.lastX) {
      y = 357;
    }
    if (mouseY > this.lastY) {
      x = 3;
    }
    if (mouseY < this.lastY) {
      x = 357;
    }
    this.rotation.set({ x, y, z: 0 });
    this.lastX = mouseX;
    this.lastY = mouseY;
  }

  public getScreenArea() {
    return this.screenArea;
  }

  private initialise(canvas: HTMLCanvasElement) {
    this.screenArea = new ScreenArea(canvas);

    this.lastX = 200;
    this.lastY = 200;
  }

  public abstract renderScene(args: RenderSceneArgs): void;

  public prepareRender(): RenderSceneArgs {
    if (!this.world || !this.renderer || !this.screenArea || !this.rotation) {
      throw Error('Invalid state');
    }

    this.world.transferObjectsToViewSpace();
    this.renderer.render(this.world, this.viewVolume);
    this.screenArea.refreshBuffer();
    return {
      world: this.world,
      rotation: this.rotation.copy(),
      objects: this.world.objectArray,
    };
  }

  public createModel(scale?: number): ModelDefinition {
    const checkedScale = scale || 1;
    switch (this.modelType) {
      case 'cube':
        return ModelDefinitionGenerator.cube(80 * checkedScale, Color.GREEN);
      case 'sphere':
        return ModelDefinitionGenerator.sphere(
          100 * checkedScale,
          24,
          Color.GREEN
        );
      case 'cylinder':
        return ModelDefinitionGenerator.cylinder(
          100 * checkedScale,
          250 * checkedScale,
          24,
          Color.GREEN
        );
      case 'tube':
        return ModelDefinitionGenerator.tube(
          100 * checkedScale,
          100 * checkedScale,
          100 * checkedScale,
          24,
          Color.GREEN
        );
      case 'surface':
        return ModelDefinitionGenerator.surfaceXY(
          80 * checkedScale,
          Color.GREEN
        );
    }
  }
}
