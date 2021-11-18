import { render, fireEvent } from '@testing-library/react-native';
import * as React from 'react';

import { View } from '../../components/redesign/View';

test('form submits two answers', async () => {
  const { container, debug } = await render(<View />);
});
