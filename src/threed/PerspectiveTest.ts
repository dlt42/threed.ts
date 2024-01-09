import Color from './common/Color';
import { Rotation, Translation } from './common/Transformation';
import ModelDefinitionGenerator from './objectdefinition/ModelDefinitionGenerator';
import ModelInstanceGenerator from './objectinstance/ModelInstanceGenerator';
import TestFrame, { RenderSceneArgs } from './TestFrame';

export class PerspectiveTest extends TestFrame {
  public addModels() {
    if (!this.world) {
      throw Error('Invalid state');
    }

    const model = ModelDefinitionGenerator.cube(50, Color.GREEN);

    const generator = new ModelInstanceGenerator();
    for (let i = 0; i < 10; i++) {
      const instance = generator.generateInstance(model);
      this.world.addModel(instance);
      this.world.transformModel(
        instance,
        new Translation({ x: 300, y: 0, z: 2200 - i * 200 })
      );
      this.world.transformModel(
        instance,
        new Rotation({ x: 0, y: 0, z: i * 54 })
      );
    }
  }

  public renderScene({ objects, world, rotation }: RenderSceneArgs) {
    for (let i = 0; i < 10; i++) {
      world.rotateModelAroundPoint(
        objects[i],
        objects[i].getWorldPosition(),
        rotation
      );
      world.transformModel(objects[i], new Rotation({ x: 0, y: 0, z: 1 }));
    }
  }
}
