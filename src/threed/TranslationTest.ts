import Color from './common/Color';
import Matrix from './common/Matrix';
import Rotation from './common/Rotation';
import Translation from './common/Translation';
import FlatShadedLightModel from './lighting/FlatShadedLightModel';
import GouraudShadedLightModel from './lighting/GouraudShadedLightModel';
import LightSource from './lighting/LightSource';
import ModelDefinition from './objectdefinition/ModelDefinition';
import ModelDefinitionGenerator from './objectdefinition/ModelDefinitionGenerator';
import ModelInstance from './objectinstance/ModelInstance';
import ModelInstanceGenerator from './objectinstance/ModelInstanceGenerator';
import DefaultColourConverter from './rendering/DefaultColourConverter';
import ShadedRenderer from './rendering/renderers/ShadedRenderer';
import WireFrameRenderer from './rendering/renderers/WireFrameRenderer';
import ScreenArea from './rendering/ScreenArea';
import ViewVolume from './rendering/ViewVolume';
import TestFrame from './TestFrame';
import ViewPoint from './world/ViewPoint';
import World from './world/World';

type LightModelType = 'flat' | 'gouraud';
const modelType: LightModelType = 'flat';

export class TranslationTest extends TestFrame {
  private rotation: Rotation = new Rotation(0, 0, 0);
  private count: number = 50;

  private add: number = -1;

  public addModels(): void {
    if (!this.world) {
      throw Error('Invalid state');
    }
    // const model: ModelDefinition = ModelDefinitionGenerator.tube(
    //   200,
    //   200,
    //   200,
    //   10,
    //   Color.GREEN
    // );

    // const model: ModelDefinition = ModelDefinitionGenerator.cylinder(
    //   200,
    //   200,
    //   30,
    //   Color.GREEN
    //);
    // const model: ModelDefinition = ModelDefinitionGenerator.sphere(
    //   200,
    //   18,
    //   Color.GREEN
    // );

    const model: ModelDefinition = ModelDefinitionGenerator.cube(
      80,
      Color.GREEN
    );
    // const model: ModelDefinition = ModelDefinitionGenerator.surfaceXY(
    //   200,
    //   Color.GREEN
    // );
    const generator: ModelInstanceGenerator = new ModelInstanceGenerator();
    for (let i: number = 0; i < 3; i++) {
      const instance: ModelInstance = generator.generateInstance(model);
      this.world.addModel(instance);
      this.world.transformModel(instance, new Translation(0, 0, 1000));
    }
  }

  public createScene(): void {
    this.viewPoint = new ViewPoint([0, 0, 0], new Rotation(0, 0, 0));
    this.lightSource = new LightSource([0, 0, 0]);

    switch (modelType) {
      case 'flat':
        this.lightModel = new FlatShadedLightModel(this.lightSource, 0.3);
        break;
      case 'gouraud':
        this.lightModel = new GouraudShadedLightModel(this.lightSource, 0.3);
        break;
    }
    this.world = new World(this.lightModel, this.viewPoint);
    // this.world.switchBackfaceCull(false);
    const screenArea: ScreenArea | null = this.getScreenArea();
    if (!screenArea) throw Error('No Screen Area');
    const shaded = true;
    this.renderer = shaded
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

  public getRotation(): Rotation | null {
    return this.rotation;
  }

  public renderScene() {
    if (!this.world || !this.renderer || !this.screenArea || !this.rotation) {
      throw Error('Invalid state');
    }
    const objects = this.world.objectArray;
    this.world.transferObjectsToViewSpace();
    this.renderer.render(this.world, this.viewVolume);
    this.screenArea.refreshBuffer();
    const rot = this.rotation.copy();
    if (this.count > 0) {
      objects[0].transformWorld(Matrix.getTranslationMatrix([10, 0, 0]));
      objects[1].transformWorld(Matrix.getTranslationMatrix([0, 10, 0]));
      objects[2].transformWorld(Matrix.getTranslationMatrix([0, 0, 10]));
    } else {
      objects[0].transformWorld(Matrix.getTranslationMatrix([-10, 0, 0]));
      objects[1].transformWorld(Matrix.getTranslationMatrix([0, -10, 0]));
      objects[2].transformWorld(Matrix.getTranslationMatrix([0, 0, -10]));
    }

    if (this.count === 50) {
      this.add = -1;
    }
    if (this.count === -49) {
      this.add = 1;
    }
    this.count += this.add;
    for (let i = 0; i < 3; i++)
      this.world.rotateModelAroundPoint(
        objects[i],
        objects[i].getWorldPosition(),
        rot
      );
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
    this.rotation.set(x, y, 0);
    this.lastX = mouseX;
    this.lastY = mouseY;
  }
}
