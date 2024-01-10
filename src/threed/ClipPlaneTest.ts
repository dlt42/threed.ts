import Color from './common/Color';
import { Translation } from './common/Transformation';
import ModelInstanceGenerator from './objectinstance/ModelInstanceGenerator';
import TestFrame from './TestFrame';

export class ClipPlaneTest extends TestFrame {
  private count = 0;

  private add = 1;
  public addModels() {
    const { world } = this.elements;

    const sphere1 = this.createModel(0.75, Color.BLUE);
    const sphere2 = this.createModel(1.15, Color.YELLOW);
    const sphere3 = this.createModel(1.5, Color.RED);
    const generator = new ModelInstanceGenerator();

    const instance1 = generator.generateInstance(sphere1);
    const instance2 = generator.generateInstance(sphere2);
    const instance3 = generator.generateInstance(sphere3);
    world.addModel(instance1);
    world.addModel(instance2);
    world.addModel(instance3);

    world.transformModel(instance1, new Translation({ x: -300, y: 0, z: 500 }));
    world.transformModel(instance2, new Translation({ x: 0, y: 0, z: 500 }));
    world.transformModel(instance3, new Translation({ x: 300, y: 0, z: 500 }));

    world.switchBackfaceCull(false);
  }

  public renderScene() {
    const { world, viewVolume } = this.elements;

    viewVolume.setFarPlaneDepth(300 + this.count);
    viewVolume.setNearPlaneDepth(200 + this.count);

    this.count += this.add;
    if (this.count == 500 || this.count == 0)
      this.add = this.add === 1 ? -1 : 1;

    world.transferObjectsToViewSpace();
  }
}
