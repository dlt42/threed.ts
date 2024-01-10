// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const root = createRoot(document.getElementById(`root`) as HTMLElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
