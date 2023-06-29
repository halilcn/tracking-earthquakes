import { fireEvent, screen, within } from '@testing-library/react'
import React from 'react'

import MagnitudeFilter from '../../../../../../src/components/tracking-map/filter-list/filter-panel/magnitude-filter'
import { FILTER_MAGNITUDE } from '../../../../../../src/constants'
import constantsTestid from '../../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('magnitude filter', () => {
  const testid = constantsTestid.magnitudeFilter

  test('should be rendered without having any problems', () => {
    renderWithProviders(<MagnitudeFilter />)
    expect(screen.queryByTestId(testid.magnitudeContainer)).toBeInTheDocument()
  })

  test('should be value of selected option when selecting an option', () => {
    renderWithProviders(<MagnitudeFilter />)

    const dropdownButton = screen.getByRole('button')
    const optionValue = Object.values(FILTER_MAGNITUDE)[1]

    fireEvent.mouseDown(dropdownButton)
    fireEvent.click(within(screen.getByRole('listbox')).getByText(optionValue))

    expect(dropdownButton).toHaveTextContent(optionValue)
  })
})
