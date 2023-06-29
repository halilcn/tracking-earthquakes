import { fireEvent, screen, within } from '@testing-library/react'
import React from 'react'

import DepthFilter from '../../../../../../src/components/tracking-map/filter-list/filter-panel/depth-filter'
import { FILTER_DEPTHS } from '../../../../../../src/constants'
import constantsTestid from '../../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('depth filter', () => {
  const testid = constantsTestid.depthFilter

  test('should be rendered without having any problems', () => {
    renderWithProviders(<DepthFilter />)
    expect(screen.queryByTestId(testid.depthContainer)).toBeInTheDocument()
  })

  test('should be value of selected option when selecting an option', () => {
    renderWithProviders(<DepthFilter />)

    const dropdownButton = screen.getByRole('button')
    const optionValue = Object.values(FILTER_DEPTHS)[1]

    fireEvent.mouseDown(dropdownButton)
    fireEvent.click(within(screen.getByRole('listbox')).getByText(optionValue))

    expect(dropdownButton).toHaveTextContent(optionValue)
  })
})
