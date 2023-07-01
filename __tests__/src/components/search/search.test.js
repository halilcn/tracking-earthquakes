import { screen } from '@testing-library/react'
import React from 'react'

import Search from '../../../../src/components/search'
import constantsTestid from '../../../../src/constants/testid'
import { renderWithProviders } from '../../../utils/renderWithProviders'

describe('search', () => {
  const testid = constantsTestid.search

  test('should be rendered without having any errors', () => {
    renderWithProviders(<Search />)

    expect(screen.queryByTestId(testid.searchContainer)).toBeInTheDocument()
  })
})
