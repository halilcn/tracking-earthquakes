import { screen } from '@testing-library/react'
import React from 'react'

import MapType from '../../../../../../../src/components/tracking-map/filter-list/settings/map-type'
import constantsTestid from '../../../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../../../utils/renderWithProviders'

describe('map type', () => {
  const testid = constantsTestid.mapType

  test('should be rendered without having any problems', () => {
    renderWithProviders(<MapType />)
    expect(screen.queryByTestId(testid.container)).toBeInTheDocument()
  })

  test('should be the default map type when there is no stored map type on local storage', () => {
    renderWithProviders(<MapType />)

    const dropdownButton = screen.getByRole('button')

    expect(dropdownButton).toHaveTextContent('DARK')
  })
})
