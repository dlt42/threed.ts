import Color from './common/Color';
import Matrix from './common/Matrix';
import { Rotation, Translation } from './common/Transformation';
import ModelDefinitionGenerator from './objectdefinition/ModelDefinitionGenerator';
import ModelInstanceGenerator from './objectinstance/ModelInstanceGenerator';
import TestFrame from './TestFrame';

export class ShadingTest extends TestFrame {
  public addModels() {
    const { world } = this.elements;

    const model1 = this.createModel(1.3, Color.GREEN);
    const model2 = ModelDefinitionGenerator.sphere(30, 60, Color.WHITE);

    const generator: ModelInstanceGenerator = new ModelInstanceGenerator();
    world.addModel(generator.generateInstance(model1));
    world.addModel(generator.generateInstance(model2));

    const objects = world.objectArray;
    world.transformModel(objects[0], new Translation({ x: 0, y: 0, z: 500 }));
  }

  public renderScene() {
    const { world, lightSource } = this.elements;
    const objects = world.objectArray;

    objects[1].setIntensityToFull();

    const rot = this.getRotation();

    const light = lightSource.getPosition();
    const point = objects[0].getWorldPosition();
    const translateToOrigin = Matrix.getTranslationMatrix([
      -point[0],
      -point[1],
      -point[2],
    ]);
    const translateToPosition = Matrix.getTranslationMatrix(point);
    let transformMatrix = Matrix.multiplyMatrices(
      translateToOrigin,
      rot.getMatrix()
    );
    transformMatrix = Matrix.multiplyMatrices(
      transformMatrix,
      translateToPosition
    );
    transformMatrix.transformCoords(light);
    lightSource.setPosition(light);
    objects[1].transformWorld(transformMatrix);
  }
}
