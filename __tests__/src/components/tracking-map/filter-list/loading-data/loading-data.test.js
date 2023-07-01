import { screen } from '@testing-library/react'
import React from 'react'

import LoadingData from '../../../../../../src/components/tracking-map/filter-list/loading-data'
import constantsTestid from '../../../../../../src/constants/testid'
import { getEarthquakeState } from '../../../../../utils'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('loading data', () => {
  const testid = constantsTestid.loadingData

  test('should be rendered without any problems when loading is true', () => {
    renderWithProviders(<LoadingData />, { preloadedState: { earthquake: getEarthquakeState({ isLoadingData: true }) } })
    expect(screen.queryByTestId(testid.container)).toBeInTheDocument()
  })

  test('should be not rendered when loading is false', () => {
    renderWithProviders(<LoadingData />, { preloadedState: { earthquake: getEarthquakeState({ isLoadingData: false }) } })
    expect(screen.queryByTestId(testid.container)).not.toBeInTheDocument()
  })
})
