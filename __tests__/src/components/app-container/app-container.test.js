import { screen } from '@testing-library/react'
import React from 'react'

import AppContainer from '../../../../src/components/app-container'
import constantsTestid from '../../../../src/constants/testid'
import { renderWithProviders } from '../../../utils/renderWithProviders'

// TODO: we should add more tests
describe('app container', () => {
  const testid = constantsTestid.appContainer

  test('should be rendered without having any errors', () => {
    renderWithProviders(<AppContainer />)

    expect(screen.queryByTestId(testid.appContainer)).toBeInTheDocument()
  })
})
