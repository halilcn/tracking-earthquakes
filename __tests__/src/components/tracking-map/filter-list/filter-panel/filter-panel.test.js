import { screen } from '@testing-library/react'
import React from 'react'

import FilterPanel from '../../../../../../src/components/tracking-map/filter-list/filter-panel'
import constantsTestid from '../../../../../../src/constants/testid'
import { initialState as earthquakeInitialState } from '../../../../../../src/store/earthquake'
import dayjs from '../../../../../../src/utils/dayjs'
import { getEarthquakeState } from '../../../../../utils'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('filter panel', () => {
  const testid = constantsTestid.filterPanel

  test('should be rendered without having any problems', () => {
    renderWithProviders(<FilterPanel />)
    expect(screen.getByTestId(testid.filterContainer)).toBeInTheDocument()
  })

  test('should be not rendered time filter when archive is enabled', () => {
    renderWithProviders(<FilterPanel />, {
      preloadedState: {
        earthquake: getEarthquakeState({ archiveDate: { ...earthquakeInitialState.archiveDate, certainDate: 15 } }),
      },
    })

    expect(screen.queryByTestId(testid.timeFilterContainer)).not.toBeInTheDocument()
  })

  test('should be not rendered time filter when animation is enabled', () => {
    renderWithProviders(<FilterPanel />, {
      preloadedState: {
        earthquake: getEarthquakeState({ animation: { ...earthquakeInitialState.animation, currentDate: dayjs().format() } }),
      },
    })

    expect(screen.queryByTestId(testid.timeFilterContainer)).not.toBeInTheDocument()
  })

  test('should be rendered remove button when one of filters is selected', () => {
    renderWithProviders(<FilterPanel />, {
      preloadedState: {
        earthquake: getEarthquakeState({ earthquakeFilter: { ...earthquakeInitialState.earthquakeFilter, time: 30 } }),
      },
    })

    expect(screen.queryByTestId(testid.removeButton)).toBeInTheDocument()
  })
})
