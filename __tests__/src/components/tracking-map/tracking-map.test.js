import { screen } from '@testing-library/react'
import React from 'react'

import TrackingMap from '../../../../src/components/tracking-map'
import constantsTestid from '../../../../src/constants/testid'
import mapboxMock from '../../../mocks/mapboxMock'
import { renderWithProviders } from '../../../utils/renderWithProviders'

describe('tracking-map', () => {
  const testid = constantsTestid.trackingMap

  beforeAll(() => {
    mapboxMock()
  })

  test('should be rendered without any problems', () => {
    renderWithProviders(<TrackingMap />)
    expect(screen.queryByTestId(testid.mapContainer)).toBeInTheDocument()
  })
})
