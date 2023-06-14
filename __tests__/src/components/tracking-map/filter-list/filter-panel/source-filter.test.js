import { screen } from '@testing-library/react'
import React from 'react'

import SourceFilter from '../../../../../../src/components/tracking-map/filter-list/filter-panel/source-filter'
import constantsTestid from '../../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('source filter', () => {
  const testid = constantsTestid.sourceFilter

  it('should be rendered without having any problems', () => {
    renderWithProviders(<SourceFilter />)
    expect(screen.queryByTestId(testid.sourceContainer)).toBeInTheDocument()
  })
})
