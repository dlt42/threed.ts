import Matrix from './common/Matrix';
import { Translation } from './common/Transformation';
import ModelInstance from './objectinstance/ModelInstance';
import ModelInstanceGenerator from './objectinstance/ModelInstanceGenerator';
import TestFrame, { RenderSceneArgs } from './TestFrame';

export class TranslationTest extends TestFrame {
  private count = 50;

  private add = -1;

  public addModels() {
    if (!this.world) {
      throw Error('Invalid state');
    }
    const model = this.createModel();
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

  public renderScene({ objects, rotation, world }: RenderSceneArgs) {
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
      world.rotateModelAroundPoint(
        objects[i],
        objects[i].getWorldPosition(),
        rotation
      );
  }
}
