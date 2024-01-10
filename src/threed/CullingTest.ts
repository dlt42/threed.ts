import { Rotation, Translation } from './common/Transformation';
import ModelDefinition from './objectdefinition/ModelDefinition';
import ModelInstanceGenerator from './objectinstance/ModelInstanceGenerator';
import TestFrame from './TestFrame';

export class CullingTest extends TestFrame {
  public addModels() {
    const { world } = this.threeD;

    const models: ModelDefinition[] = [];
    const generator = new ModelInstanceGenerator();
    for (let i = 0; i < 36; i++) {
      models[i] = this.createModel(0.25);
      world.addModel(generator.generateInstance(models[i]));
    }

    const objects = world.objectArray;
    for (let j = 0; j < 36; j++) {
      const model = objects[j];
      world.transformModel(model, new Rotation({ x: j * 10, y: 0, z: 0 }));
      world.transformModel(model, new Translation({ x: 0, y: 0, z: 150 }));
      world.rotateModelAroundPoint(
        objects[j],
        [0, 0, 500],
        new Rotation({ x: 0, y: j * 10, z: 0 })
      );
    }
  }

  public renderScene() {
    const { world } = this.threeD;
    const objects = world.objectArray;
    for (let i = 0; i < objects.length; i++)
      world.rotateModelAroundPoint(objects[i], [0, 0, 500], this.getRotation());
  }
}
