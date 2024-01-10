import { useEffect, useState } from 'react';

import { ClipPlaneTest } from './threed/ClipPlaneTest';
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

type ConfigSelectProps<T> = {
  value: keyof T;
  id: string;
  setValue: (value: keyof T) => void;
  values: { label: string; value: keyof T }[];
};

const ConfigSelect = <T,>({
  id,
  value,
  setValue,
  values,
}: ConfigSelectProps<T>) => {
  return (
    <select
      id={id}
      value={value.toString()}
      onChange={(e) => setValue(e.target.value as keyof T)}
      style={{ fontSize: '1rem', padding: '.25rem' }}
    >
      {values.map((current, index) => (
        <option key={`${id}-${index}`} value={current.value.toString()}>
          {current.label}
        </option>
      ))}
    </select>
  );
};

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
      }
      frame.addModels();
      const intervalToStop = setInterval(
        () => {
          frame.prepareRender();
          frame.renderScene();
        },
        testType === 'clip-plane' ? 0 : 10
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
          <option value='clip-plane'>Clip Plane</option>
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
          <ConfigSelect
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
