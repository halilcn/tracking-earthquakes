import { screen } from '@testing-library/react'
import React from 'react'

import UpdateTimer from '../../../../../src/components/tracking-map/update-timer'
import { MAP_UPDATE_MIN } from '../../../../../src/constants'
import constantsTestid from '../../../../../src/constants/testid'
import { getEarthquakeState } from '../../../../utils'
import { renderWithProviders } from '../../../../utils/renderWithProviders'

describe('update timer', () => {
  const testid = constantsTestid.updateTimer

  test('should be rendered without having any problems', () => {
    renderWithProviders(<UpdateTimer />)
    expect(screen.queryByTestId(testid.timerContainer)).toBeInTheDocument()
  })

  test('should be rendered with map update minutes', () => {
    renderWithProviders(<UpdateTimer />)
    expect(screen.getByText(`${MAP_UPDATE_MIN} minutes`)).toBeInTheDocument()
  })

  test('should be not rendered when archive is selected or animation is activated', () => {
    renderWithProviders(<UpdateTimer />, {
      preloadedState: { earthquake: getEarthquakeState({ archiveDate: { certainDate: 1 }, animation: { currentDate: 1 } }) },
    })
    expect(screen.queryByTestId(testid.timerContainer)).not.toBeInTheDocument()
  })
})
