import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import App from './App';

it('should render without crashing', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<App />);
});
