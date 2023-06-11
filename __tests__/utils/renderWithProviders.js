import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'

import storeConfig from '../../src/store/index'

export function renderWithProviders(ui, { preloadedState = {}, store = storeConfig({ preloadedState }), ...renderOptions } = {}) {
  const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>
  return { store, ...render(ui, { wrapper, ...renderOptions }) }
}
