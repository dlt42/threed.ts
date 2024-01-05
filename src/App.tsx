import { useEffect } from 'react';

import { TranslationTest } from './threed/TranslationTest';

const App = () => {
  useEffect(() => {
    try {
      const canvas: HTMLCanvasElement | null = document.getElementById(
        'renderCanvas'
      ) as HTMLCanvasElement;
      if (!canvas) throw Error('Canvas not found');
      const frame: TranslationTest = new TranslationTest(canvas);
      frame.createScene();
      frame.addModels();
      const intervalToStop = setInterval(() => {
        frame.renderScene();
      }, 10);
      return () => {
        clearInterval(intervalToStop);
      };
    } catch (e) {
      console.log(e);
    }
  });
  return <></>;
};

export default App;
