import { screen } from '@testing-library/react'
import React from 'react'

import Animation from '../../../../../../src/components/tracking-map/filter-list/animation'
import constantsTestid from '../../../../../../src/constants/testid'
import { initialState } from '../../../../../../src/store/earthquake'
import dayjs from '../../../../../../src/utils/dayjs'
import { getEarthquakeState } from '../../../../../utils'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('animation', () => {
  const testid = constantsTestid.animation

  test('should be rendered without any problems', () => {
    renderWithProviders(<Animation />)
    expect(screen.queryByTestId(testid.animationContainer)).toBeInTheDocument()
  })

  test('track time should be rendered when animation is activated', () => {
    renderWithProviders(<Animation />, {
      preloadedState: { earthquake: getEarthquakeState({ animation: { ...initialState.animation, currentDate: dayjs().format() } }) },
    })
    expect(screen.queryByTestId(testid.trackTime)).toBeInTheDocument()
  })
})
