import { screen } from '@testing-library/react'
import React from 'react'

import EarthquakeList from '../../../../src/components/earthquake-list'
import constantsTestid from '../../../../src/constants/testid'
import { initialState as earthquakeInitialState } from '../../../../src/store/earthquake'
import { getMockNewEarthquake } from '../../../mocks'
import { renderWithProviders } from '../../../utils/renderWithProviders'

describe('earthquake item', () => {
  const testid = constantsTestid.earthquakeList

  test('should be render without having any problems', () => {
    renderWithProviders(<EarthquakeList />)

    expect(screen.queryByTestId(testid.listContainer)).toBeInTheDocument()
  })

  test('should be rendered list when there are earthquakes', () => {
    renderWithProviders(<EarthquakeList />, {
      preloadedState: { earthquake: { ...earthquakeInitialState, earthquakes: [getMockNewEarthquake()] } },
    })

    expect(screen.queryByTestId(testid.noEarthquakeWarn)).not.toBeInTheDocument()
    expect(screen.queryByTestId(testid.list)).toBeInTheDocument()
  })

  test('should be rendered warning message when there are not any earthquakes', () => {
    renderWithProviders(<EarthquakeList />, {
      preloadedState: { earthquake: { ...earthquakeInitialState, earthquakes: [] } },
    })

    expect(screen.queryByTestId(testid.list)).not.toBeInTheDocument()
    expect(screen.queryByTestId(testid.noEarthquakeWarn)).toBeInTheDocument()
  })
})
