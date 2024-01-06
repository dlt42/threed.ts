import Color from './common/Color';
import Matrix from './common/Matrix';
import { Rotation, Translation } from './common/Transformation';
import LightModel from './lighting/LightModel';
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

export class TranslationTest extends TestFrame {
  private rotation: Rotation = new Rotation({ x: 0, y: 0, z: 0 });
  private count = 50;

  private add = -1;

  public addModels() {
    if (!this.world) {
      throw Error('Invalid state');
    }
    let model: ModelDefinition;
    model = ModelDefinitionGenerator.tube(200, 200, 200, 10, Color.GREEN);
    // model = ModelDefinitionGenerator.cylinder(200, 200, 30, Color.GREEN);
    // model = ModelDefinitionGenerator.sphere(200, 18, Color.GREEN);
    // model = ModelDefinitionGenerator.surfaceXY(200, Color.GREEN);
    model = ModelDefinitionGenerator.cube(80, Color.GREEN);
    const generator: ModelInstanceGenerator = new ModelInstanceGenerator();
    for (let i = 0; i < 3; i++) {
      const instance: ModelInstance = generator.generateInstance(model);
      this.world.addModel(instance);
      this.world.transformModel(
        instance,
        new Translation({ x: 0, y: 0, z: 1000 })
      );
    }
  }

  public createScene() {
    this.viewPoint = new ViewPoint(
      [0, 0, 0],
      new Rotation({ x: 0, y: 0, z: 0 })
    );
    this.lightSource = new LightSource([0, 0, 0]);

    this.lightModel = new LightModel(this.lightSource, 0.3, 'flat');

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

  public getRotation() {
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
    this.rotation.set({ x, y, z: 0 });
    this.lastX = mouseX;
    this.lastY = mouseY;
  }
}
