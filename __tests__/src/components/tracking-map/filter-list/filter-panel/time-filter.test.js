import { screen } from '@testing-library/react'
import React from 'react'

import TimeFilter from '../../../../../../src/components/tracking-map/filter-list/filter-panel/time-filter'
import constantsTestid from '../../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('time filter', () => {
  const testid = constantsTestid.timeFilter

  test('should be rendered without having any problems', () => {
    renderWithProviders(<TimeFilter />)
    expect(screen.queryByTestId(testid.timeContainer)).toBeInTheDocument()
  })
})
