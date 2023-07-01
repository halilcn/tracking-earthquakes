import { screen } from '@testing-library/react'
import React from 'react'

import TrackTime from '../../../../../../../src/components/tracking-map/filter-list/animation/track-time'
import constantsTestid from '../../../../../../../src/constants/testid'
import { initialState } from '../../../../../../../src/store/earthquake'
import { renderWithProviders } from '../../../../../../utils/renderWithProviders'

describe('track time', () => {
  const testid = constantsTestid.trackTime

  test('should be rendered without having any errors', () => {
    renderWithProviders(<TrackTime />)
    expect(screen.queryByTestId(testid.container)).toBeInTheDocument()
  })

  test('range input should be disabled when the animation is activated', () => {
    renderWithProviders(<TrackTime />, {
      preloadedState: { earthquake: { animation: { ...initialState.animation, isActive: true } } },
    })
    expect(screen.queryByTestId(testid.rangeInput)).toBeDisabled()
  })
})
