import Color from './common/Color';
import { Coords } from './common/common.types';
import Matrix from './common/Matrix';
import { Rotation, Translation } from './common/Transformation';
import ModelDefinitionGenerator from './objectdefinition/ModelDefinitionGenerator';
import ModelInstanceGenerator from './objectinstance/ModelInstanceGenerator';
import TestFrame from './TestFrame';

export class LightSourceTest extends TestFrame {
  private count = 0;
  private time = new Date().getTime();
  private totalTime = 0;
  n = 0;

  public addModels() {
    const { world } = this.elements;

    const planet1 = ModelDefinitionGenerator.sphere(75, 15, Color.MAGENTA);
    const planet2 = ModelDefinitionGenerator.sphere(50, 15, Color.GREEN);
    const planet3 = ModelDefinitionGenerator.sphere(25, 15, Color.BLUE);
    const sun = ModelDefinitionGenerator.sphere(90, 15, Color.RED);
    const generator = new ModelInstanceGenerator();

    world.addModel(generator.generateInstance(sun));
    world.addModel(generator.generateInstance(planet3));
    world.addModel(generator.generateInstance(planet2));
    world.addModel(generator.generateInstance(planet3));
    world.addModel(generator.generateInstance(planet1));
    world.addModel(generator.generateInstance(planet3));

    const objects = world.objectArray;
    world.transformModel(objects[0], new Translation({ x: 0, y: 0, z: 800 }));
    world.transformModel(objects[1], new Translation({ x: 0, y: 0, z: 700 }));
    world.transformModel(objects[2], new Translation({ x: 0, y: 0, z: 600 }));
    world.transformModel(objects[3], new Translation({ x: 0, y: 0, z: 500 }));
    world.transformModel(objects[4], new Translation({ x: 0, y: 0, z: 400 }));
    world.transformModel(objects[5], new Translation({ x: 0, y: 0, z: 300 }));

    objects[0].setIntensityToFull();
  }

  public renderScene() {
    const { world, lightSource } = this.elements;
    const objects = world.objectArray;

    if (this.count++ == 100) {
      const current = new Date().getTime();
      this.totalTime += current - this.time;
      this.time = current;
      this.count = 0;
      const framesPerSecond = 100 / (this.totalTime / 1000);
      this.totalTime = 0;
      console.log('Frames Per Second: ' + framesPerSecond);
    }
    const transformMatrix = Matrix.getRotateModelAroundPoint(
      objects[0].getWorldPosition(),
      this.getRotation()
    );
    lightSource.setPosition(objects[0].getWorldPosition());
    objects[0].setIntensityToFull();
    objects[1].transformWorld(transformMatrix);
    objects[2].transformWorld(transformMatrix);
    objects[2].transformWorld(transformMatrix);
    objects[3].transformWorld(transformMatrix);
    objects[4].transformWorld(transformMatrix);
    objects[4].transformWorld(transformMatrix);
    objects[5].transformWorld(transformMatrix);
    objects[5].transformWorld(transformMatrix);
    objects[5].transformWorld(transformMatrix);
    this.rotateViewPoint(objects[0].getWorldPosition());
  }

  public mouseDragged(mouseX: number, mouseY: number) {
    const adj = 0.5;
    let y = 0;
    if (mouseX > this.lastX) {
      y = adj;
    }
    if (mouseX < this.lastX) {
      y = 360 - adj;
    }
    this.rotation.set({ x: 0, y, z: 0 });
    this.lastX = mouseX;
    this.lastY = mouseY;
  }

  public rotateViewPoint(point: Coords) {
    const { viewPoint } = this.elements;
    this.n = (this.n + 1) % 3599;
    if (this.n == 0) {
      viewPoint.setPosition([0, 0, 0]);
      viewPoint.setOrientation(new Rotation({ x: 0, y: 0, z: 0 }));
    }
    const transformMatrix = Matrix.multiplyMatrices(
      Matrix.multiplyMatrices(
        Matrix.getTranslationMatrix([-point[0], -point[1], -point[2]]),
        Matrix.getRotationMatrix(new Rotation({ x: 0.5, y: 0, z: 0 }))
      ),
      Matrix.getTranslationMatrix(point)
    );
    const view = viewPoint.getPosition();
    transformMatrix.transformCoords(view);
    const rot = viewPoint.getOrientation();
    rot.adj({
      x: 359.5,
      y: 0,
      z: 0,
    });
    viewPoint.setPosition(view);
    viewPoint.setOrientation(rot);
  }
}
