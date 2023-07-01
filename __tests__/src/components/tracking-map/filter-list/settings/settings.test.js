import { screen } from '@testing-library/react'
import React from 'react'

import Settings from '../../../../../../src/components/tracking-map/filter-list/settings'
import constantsTestid from '../../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('settings', () => {
  const testid = constantsTestid.settings

  test('should be rendered without having any problems', () => {
    renderWithProviders(<Settings />)
    expect(screen.queryByTestId(testid.container)).toBeInTheDocument()
  })

  test('full screen should not be rendered when the device is mobile', () => {
    global.window.innerWidth = 600
    renderWithProviders(<Settings />)

    expect(screen.queryByTestId(testid.fullScreenButton)).not.toBeInTheDocument()
  })
})
