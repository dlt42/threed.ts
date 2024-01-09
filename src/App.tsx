import { useEffect, useState } from 'react';

import { PerspectiveTest } from './threed/PerspectiveTest';
import TestFrame from './threed/TestFrame';
import { TranslationTest } from './threed/TranslationTest';

type TestType = 'translation' | 'perspective';

const App = () => {
  const [testType, setTestType] = useState<TestType>('perspective');
  useEffect(() => {
    try {
      const canvas: HTMLCanvasElement | null = document.getElementById(
        'renderCanvas'
      ) as HTMLCanvasElement;
      if (!canvas) throw Error('Canvas not found');
      let frame: TestFrame;
      switch (testType) {
        case 'translation':
          frame = new TranslationTest(canvas);
          break;
        case 'perspective':
          frame = new PerspectiveTest(canvas);
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
      <select
        id='test-type'
        onChange={(e) => setTestType(e.target.value as TestType)}
        style={{ fontSize: '1rem', padding: '.25rem' }}
      >
        <option value='perspective'>Perspective</option>
        <option value='translation'>Translation</option>
      </select>
    </div>
  );
};

export default App;
