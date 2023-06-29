import { fireEvent, screen, within } from '@testing-library/react'
import React from 'react'

import TimeFilter from '../../../../../../src/components/tracking-map/filter-list/filter-panel/time-filter'
import { FILTER_TIME } from '../../../../../../src/constants'
import constantsTestid from '../../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('time filter', () => {
  const testid = constantsTestid.timeFilter

  test('should be rendered without having any problems', () => {
    renderWithProviders(<TimeFilter />)
    expect(screen.queryByTestId(testid.timeContainer)).toBeInTheDocument()
  })

  test('should be value of selected option when selecting an option', () => {
    renderWithProviders(<TimeFilter />)

    const dropdownButton = screen.getByRole('button')
    const optionValue = Object.values(FILTER_TIME)[1]

    fireEvent.mouseDown(dropdownButton)
    fireEvent.click(within(screen.getByRole('listbox')).getByText(optionValue))

    expect(dropdownButton).toHaveTextContent(optionValue)
  })
})
