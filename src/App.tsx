import { useEffect, useState } from 'react';

import { CullingTest } from './threed/CullingTest';
import { LightModelType } from './threed/lighting/lighting.types';
import { PerspectiveTest } from './threed/PerspectiveTest';
import TestFrame, {
  ModelType,
  RenderType,
  TestFrameParams,
  TestType,
} from './threed/TestFrame';
import { TranslationTest } from './threed/TranslationTest';

const App = () => {
  const [testType, setTestType] = useState<TestType>('perspective');
  const [renderType, setRenderType] = useState<RenderType>('shaded');
  const [lightModelType, setLightModelType] = useState<LightModelType>('flat');
  const [modelType, setModelType] = useState<ModelType>('cube');

  useEffect(() => {
    try {
      const canvas: HTMLCanvasElement | null = document.getElementById(
        'renderCanvas'
      ) as HTMLCanvasElement;

      if (!canvas) throw Error('Canvas not found');
      const testFrameParams: TestFrameParams = {
        canvas,
        lightModelType,
        renderType,
        modelType,
      };
      let frame: TestFrame;
      switch (testType) {
        case 'translation':
          frame = new TranslationTest(testFrameParams);
          break;
        case 'perspective':
          frame = new PerspectiveTest(testFrameParams);
          break;
        case 'culling':
          frame = new CullingTest(testFrameParams);
          break;
      }
      frame.createScene();
      frame.addModels();
      const intervalToStop = setInterval(() => {
        frame.renderScene(frame.prepareRender());
      }, 10);
      return () => {
        clearInterval(intervalToStop);
      };
    } catch (e) {
      console.log(e);
    }
  });
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        padding: '1rem',
        gap: '1rem',
        height: '100%',
        alignItems: 'center',
      }}
    >
      <canvas
        id='renderCanvas'
        style={{
          border: '1px solid black',
          width: '100%',
          height: '100%',
          display: 'block',
          backgroundColor: 'black',
        }}
      ></canvas>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
        }}
      >
        <select
          id='test-type'
          value={testType}
          onChange={(e) => setTestType(e.target.value as TestType)}
          style={{ fontSize: '1rem', padding: '.25rem' }}
        >
          <option value='perspective'>Perspective</option>
          <option value='translation'>Translation</option>
          <option value='culling'>Culling</option>
        </select>
        <select
          id='render-type'
          value={renderType}
          onChange={(e) => setRenderType(e.target.value as RenderType)}
          style={{ fontSize: '1rem', padding: '.25rem' }}
        >
          <option value='shaded'>Shaded</option>
          <option value='wireframe'>Wireframe</option>
        </select>
        {renderType !== 'wireframe' && (
          <select
            id='light-model-type'
            value={lightModelType}
            onChange={(e) =>
              setLightModelType(e.target.value as LightModelType)
            }
            style={{ fontSize: '1rem', padding: '.25rem' }}
          >
            <option value='flat'>Flat</option>
            <option value='normal'>Normal</option>
            <option value='gouraud'>Gouraud</option>
          </select>
        )}
        <select
          id='shape-type'
          value={modelType}
          onChange={(e) => setModelType(e.target.value as ModelType)}
          style={{ fontSize: '1rem', padding: '.25rem' }}
        >
          <option value='cube'>Cube</option>
          <option value='sphere'>Sphere</option>
          <option value='cylinder'>Cylinder</option>
          <option value='tube'>Tube</option>
          <option value='surface'>Surface</option>
        </select>
      </div>
    </div>
  );
};

export default App;
