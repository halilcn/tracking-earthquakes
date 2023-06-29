import { fireEvent, screen, within } from '@testing-library/react'
import React from 'react'

import SourceFilter from '../../../../../../src/components/tracking-map/filter-list/filter-panel/source-filter'
import { SOURCES } from '../../../../../../src/constants'
import constantsTestid from '../../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('source filter', () => {
  const testid = constantsTestid.sourceFilter

  test('should be rendered without having any problems', () => {
    renderWithProviders(<SourceFilter />)
    expect(screen.queryByTestId(testid.sourceContainer)).toBeInTheDocument()
  })

  test('should be selected all sources after rendering', () => {
    renderWithProviders(<SourceFilter />)
    Object.values(SOURCES).map(source => expect(screen.getByRole('button')).toHaveTextContent(source))
  })

  test('should be value of selected option when selecting an option', () => {
    renderWithProviders(<SourceFilter />)

    const dropdownButton = screen.getByRole('button')
    const optionValue = Object.values(SOURCES)[0]
    const expectedValue = Object.values(SOURCES)[1]

    fireEvent.mouseDown(dropdownButton)
    fireEvent.click(within(screen.getByRole('listbox')).getByText(optionValue))

    expect(dropdownButton).toHaveTextContent(expectedValue)
  })
})
