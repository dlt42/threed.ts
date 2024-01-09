import { useEffect, useState } from 'react';

import { PerspectiveTest } from './threed/PerspectiveTest';
import TestFrame, { RenderType } from './threed/TestFrame';
import { TranslationTest } from './threed/TranslationTest';

type TestType = 'translation' | 'perspective';

const App = () => {
  const [testType, setTestType] = useState<TestType>('perspective');
  const [renderType, setRenderType] = useState<RenderType>('shaded');
  useEffect(() => {
    try {
      const canvas: HTMLCanvasElement | null = document.getElementById(
        'renderCanvas'
      ) as HTMLCanvasElement;
      if (!canvas) throw Error('Canvas not found');
      let frame: TestFrame;
      switch (testType) {
        case 'translation':
          frame = new TranslationTest(canvas, renderType);
          break;
        case 'perspective':
          frame = new PerspectiveTest(canvas, renderType);
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
        flexGrow: '1',
        alignItems: 'center',
      }}
    >
      <canvas
        id='renderCanvas'
        width='600'
        height='600'
        style={{
          border: '1px solid black',
          width: '600px',
          height: '600px',
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
      </div>
    </div>
  );
};

export default App;
