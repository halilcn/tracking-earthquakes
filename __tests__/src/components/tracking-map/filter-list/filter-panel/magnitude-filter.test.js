import { screen } from '@testing-library/react'
import React from 'react'

import MagnitudeFilter from '../../../../../../src/components/tracking-map/filter-list/filter-panel/magnitude-filter'
import constantsTestid from '../../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('magnitude filter', () => {
  const testid = constantsTestid.magnitudeFilter

  test('should be rendered without having any problems', () => {
    renderWithProviders(<MagnitudeFilter />)
    expect(screen.queryByTestId(testid.magnitudeContainer)).toBeInTheDocument()
  })
})
