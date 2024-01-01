import { screen } from '@testing-library/react'
import React from 'react'

import UpdateTimer from '../../../../../src/components/tracking-map/update-timer'
import constantsTestid from '../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../utils/renderWithProviders'

describe('update timer', () => {
  const testid = constantsTestid.updateTimer

  test('should be rendered without having any problems', () => {
    renderWithProviders(<UpdateTimer />)
    expect(screen.queryByTestId(testid.timerContainer)).toBeInTheDocument()
  })
})
