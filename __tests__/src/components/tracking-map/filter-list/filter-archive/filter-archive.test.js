import { fireEvent, screen, within } from '@testing-library/react'
import React from 'react'

import FilterArchive from '../../../../../../src/components/tracking-map/filter-list/filter-archive'
import { ARCHIVE_CERTAIN_TIMES } from '../../../../../../src/constants'
import constantsTestid from '../../../../../../src/constants/testid'
import { getEarthquakeState } from '../../../../../utils/index'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('filter archive', () => {
  const testid = constantsTestid.filterArchive

  test('should be rendered without having any errors', () => {
    renderWithProviders(<FilterArchive />)
    expect(screen.queryByTestId(testid.container)).toBeInTheDocument()
  })

  test('clear button should be rendered when certain date is selected', () => {
    renderWithProviders(<FilterArchive />)

    const dropdownButton = screen.getByRole('button')
    const optionValue = Object.values(ARCHIVE_CERTAIN_TIMES)[1]

    fireEvent.mouseDown(dropdownButton)
    fireEvent.click(within(screen.getByRole('listbox')).getByText(optionValue))

    expect(screen.queryByTestId(testid.clearButton)).toBeInTheDocument()
  })
})
