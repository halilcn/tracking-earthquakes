import { screen } from '@testing-library/react'
import React from 'react'

import DepthFilter from '../../../../../../src/components/tracking-map/filter-list/filter-panel/depth-filter'
import constantsTestid from '../../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('depth filter', () => {
  const testid = constantsTestid.depthFilter

  test('should be rendered without having any problems', () => {
    renderWithProviders(<DepthFilter />)
    expect(screen.queryByTestId(testid.depthContainer)).toBeInTheDocument()
  })
})
