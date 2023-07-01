import { fireEvent, screen } from '@testing-library/react'
import React from 'react'

import FullScreen from '../../../../../../../src/components/tracking-map/filter-list/settings/full-screen'
import constantsTestid from '../../../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../../../utils/renderWithProviders'

describe('full screen', () => {
  const testid = constantsTestid.fullScreen

  test('should be rendered without having any errors', () => {
    renderWithProviders(<FullScreen />)
    expect(screen.queryByTestId(testid.fullScreenButton)).toBeInTheDocument()
  })

  test('should be called when full screen button is clicked', () => {
    renderWithProviders(<FullScreen />)

    const mockRequestFullscreen = jest.fn()
    global.document.documentElement.requestFullscreen = mockRequestFullscreen

    fireEvent.click(screen.queryByTestId(testid.fullScreenButton))

    expect(mockRequestFullscreen).toHaveBeenCalled()
  })
})
