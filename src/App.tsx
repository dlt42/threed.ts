import { useEffect, useState } from 'react';

import ConfigSelect from './ConfigSelect';
import { ClipPlaneTest } from './threed/ClipPlaneTest';
import { CullingTest } from './threed/CullingTest';
import { LightModelType } from './threed/lighting/lighting.types';
import { LightSourceTest } from './threed/LightSourceTest';
import { PerspectiveTest } from './threed/PerspectiveTest';
import { ShadingTest } from './threed/ShadingTest';
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
        config: { lightModelType, renderType, modelType },
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
        case 'clip-plane':
          frame = new ClipPlaneTest(testFrameParams);
          break;
        case 'shading':
          frame = new ShadingTest(testFrameParams);
          break;
        case 'light-source':
          frame = new LightSourceTest(testFrameParams);
          break;
      }
      frame.addModels();
      const intervalToStop = setInterval(
        () => {
          frame.prepareRender();
          frame.renderScene();
        },
        testType === 'clip-plane' ? 0 : 0
      );
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
        height: '100svh',
        maxHeight: '100svh',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <canvas
          id='renderCanvas'
          style={{
            border: '1px solid black',
            width: '100%',
            backgroundColor: 'black',
          }}
        ></canvas>
      </div>
      <div
        style={{
          flexGrow: 0,
          flexShrink: 0,
          flexBasis: '0%',
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
        }}
      >
        <ConfigSelect
          label='Test'
          id='test-type'
          setValue={setTestType}
          value={testType}
          values={[
            { label: 'Perspective', value: 'perspective' },
            { label: 'Translation', value: 'translation' },
            { label: 'Culling', value: 'culling' },
            { label: 'Clip Plane', value: 'clip-plane' },
            { label: 'Shading', value: 'shading' },
            { label: 'Light Source', value: 'light-source' },
          ]}
        />

        <ConfigSelect
          label='Render'
          id='render-type'
          setValue={setRenderType}
          value={renderType}
          values={[
            { label: 'Shaded', value: 'shaded' },
            { label: 'Wireframe', value: 'wireframe' },
          ]}
        />

        {renderType !== 'wireframe' && (
          <ConfigSelect
            label='Light Model'
            id='light-model-type'
            setValue={setLightModelType}
            value={lightModelType}
            values={[
              { label: 'Flat', value: 'flat' },
              { label: 'Normal', value: 'normal' },
              { label: 'Gouraud', value: 'gouraud' },
            ]}
          />
        )}

        <ConfigSelect
          label='Model'
          id='model-type'
          setValue={setModelType}
          value={modelType}
          values={[
            { label: 'Cube', value: 'cube' },
            { label: 'Sphere', value: 'sphere' },
            { label: 'Cylinder', value: 'cylinder' },
            { label: 'Tube', value: 'tube' },
            { label: 'Surface', value: 'surface' },
          ]}
        />
      </div>
    </div>
  );
};

export default App;
