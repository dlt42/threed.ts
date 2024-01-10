import { Rotation, Translation } from './common/Transformation';
import ModelInstanceGenerator from './objectinstance/ModelInstanceGenerator';
import TestFrame from './TestFrame';

export class PerspectiveTest extends TestFrame {
  public addModels() {
    const { world } = this.threeD;

    const model = this.createModel();

    const generator = new ModelInstanceGenerator();
    for (let i = 0; i < 10; i++) {
      const instance = generator.generateInstance(model);
      world.addModel(instance);
      world.transformModel(
        instance,
        new Translation({ x: 300, y: 0, z: 2200 - i * 200 })
      );
      world.transformModel(instance, new Rotation({ x: 0, y: 0, z: i * 54 }));
    }
  }

  public renderScene() {
    const { world } = this.threeD;
    const objects = world.objectArray;
    for (let i = 0; i < 10; i++) {
      world.rotateModelAroundPoint(
        objects[i],
        objects[i].getWorldPosition(),
        this.getRotation()
      );
      world.transformModel(objects[i], new Rotation({ x: 0, y: 0, z: 1 }));
    }
  }
}
