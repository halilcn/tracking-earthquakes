import { fireEvent, screen, within } from '@testing-library/react'
import React from 'react'

import FilterItems from '../../../../../../../src/components/tracking-map/filter-list/animation/filter-items'
import { ANIMATION_RANGES } from '../../../../../../../src/constants'
import constantsTestid from '../../../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../../../utils/renderWithProviders'

describe('filter items', () => {
  const testid = constantsTestid.filterItems

  test('should be rendered without having any problems', () => {
    renderWithProviders(<FilterItems />)
    expect(screen.queryByTestId(testid.container)).toBeInTheDocument()
  })

  test('should be selected value then selecting a range value', () => {
    renderWithProviders(<FilterItems />)

    const dropdownButton = screen.getByRole('button')
    const optionValue = Object.values(ANIMATION_RANGES)[0]

    fireEvent.mouseDown(dropdownButton)
    fireEvent.click(within(screen.getByRole('listbox')).getByText(optionValue))

    expect(dropdownButton).toHaveTextContent(optionValue)
  })
})
