import Color from './common/Color';
import { Rotation } from './common/Transformation';
import { LightModelType } from './lighting/lighting.types';
import LightModel from './lighting/LightModel';
import LightSource from './lighting/LightSource';
import ModelDefinition from './objectdefinition/ModelDefinition';
import ModelDefinitionGenerator from './objectdefinition/ModelDefinitionGenerator';
import DefaultColourConverter from './rendering/DefaultColourConverter';
import Renderer from './rendering/renderers/Renderer';
import ShadedRenderer from './rendering/renderers/ShadedRenderer';
import WireFrameRenderer from './rendering/renderers/WireFrameRenderer';
import ScreenArea from './rendering/ScreenArea';
import ViewVolume from './rendering/ViewVolume';
import ViewPoint from './world/ViewPoint';
import World from './world/World';

export type RenderType = 'shaded' | 'wireframe';

export type TestType =
  | 'translation'
  | 'perspective'
  | 'culling'
  | 'clip-plane'
  | 'shading';
export type ModelType = 'cube' | 'sphere' | 'cylinder' | 'tube' | 'surface';

export type TestFrameParams = {
  canvas: HTMLCanvasElement;
  config: TestFrameConfig;
};

export type TestFrameConfig = {
  renderType: RenderType;
  lightModelType: LightModelType;
  modelType: ModelType;
};

type Elements = {
  world: World;
  lightModel: LightModel;
  lightSource: LightSource;
  viewPoint: ViewPoint;
  renderer: Renderer;
  viewVolume: ViewVolume;
  screenArea: ScreenArea;
};

export default abstract class TestFrame {
  private lastX = 0;
  private lastY = 0;

  protected elements: Elements;
  protected config: TestFrameConfig;

  private rotation: Rotation = new Rotation({ x: 0, y: 0, z: 0 });

  public constructor(params: TestFrameParams) {
    const { config } = params;
    this.config = config;
    this.elements = TestFrame.initialise(params);

    this.lastX = 200;
    this.lastY = 200;
    this.elements.screenArea.getCanvas().addEventListener('mousemove', (e) => {
      const flags = e.buttons !== undefined ? e.buttons : e.which;
      if ((flags & 1) === 1) {
        this.mouseDragged(e.pageX, e.pageY);
      }
    });
  }

  public abstract addModels(): void;

  public static initialise({
    canvas,
    config: { lightModelType, renderType },
  }: TestFrameParams): Elements {
    const viewPoint = new ViewPoint(
      [0, 0, 0],
      new Rotation({ x: 0, y: 0, z: 0 })
    );
    const lightSource = new LightSource([0, 0, 0]);
    const lightModel = new LightModel(lightSource, 0.3, lightModelType);
    const world = new World(lightModel, viewPoint);
    // this.world.switchBackfaceCull(false);
    const screenArea = new ScreenArea(canvas);
    const renderer =
      renderType === 'shaded'
        ? new ShadedRenderer(screenArea, new DefaultColourConverter())
        : new WireFrameRenderer(screenArea, new DefaultColourConverter());
    const viewVolume = new ViewVolume(100, 10000);
    screenArea.addListener(viewVolume);
    return {
      viewPoint,
      lightSource,
      lightModel,
      world,
      screenArea,
      renderer,
      viewVolume,
    };
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

  public abstract renderScene(): void;

  public prepareRender() {
    const { world, renderer, viewVolume, screenArea } = this.elements;

    world.transferObjectsToViewSpace();
    renderer.render(world, viewVolume);
    screenArea.refreshBuffer();
    return {
      world: world,
      rotation: this.rotation.copy(),
      objects: world.objectArray,
      viewVolume: viewVolume,
    };
  }

  protected getRotation() {
    return this.rotation.copy();
  }

  public createModel(scale?: number, color?: Color): ModelDefinition {
    const { modelType } = this.config;
    const checkedScale = scale || 1;
    color = color || Color.GREEN;
    switch (modelType) {
      case 'cube':
        return ModelDefinitionGenerator.cube(80 * checkedScale, color);
      case 'sphere':
        return ModelDefinitionGenerator.sphere(100 * checkedScale, 24, color);
      case 'cylinder':
        return ModelDefinitionGenerator.cylinder(
          100 * checkedScale,
          250 * checkedScale,
          24,
          color
        );
      case 'tube':
        return ModelDefinitionGenerator.tube(
          100 * checkedScale,
          100 * checkedScale,
          100 * checkedScale,
          24,
          color
        );
      case 'surface':
        return ModelDefinitionGenerator.surfaceXY(80 * checkedScale, color);
    }
  }
}
