import { fireEvent, screen, within } from '@testing-library/react'
import React from 'react'
import { FiPlay } from 'react-icons/fi'

import FilterList from '../../../../../src/components/tracking-map/filter-list'
import Animation from '../../../../../src/components/tracking-map/filter-list/animation'
import constantsTestid from '../../../../../src/constants/testid'
import { renderWithProviders } from '../../../../utils/renderWithProviders'

describe('filter list', () => {
  const testid = constantsTestid.filterList

  test('should be rendered without any errors', () => {
    renderWithProviders(<FilterList />)
    expect(screen.queryByTestId(testid.listContainer)).toBeInTheDocument()
  })

  test('should be have selected class name when the item is selected', () => {
    const { container } = renderWithProviders(<FilterList />)
    const animationFilter = container.querySelector(`[data-type='animation'] > [data-testid='${testid.listItem}']`)
    const expectedClassName = 'filter__item--selected'

    fireEvent.click(animationFilter)

    expect(animationFilter).toHaveClass(expectedClassName)
  })

  test('should be rendered correct content when clicking an item', () => {
    const { container } = renderWithProviders(<FilterList />)

    const animationFilter = container.querySelector(`[data-type='animation'] > [data-testid='${testid.listItem}']`)
    fireEvent.click(animationFilter)

    const animationContainer = within(screen.getByTestId(testid.content)).getByTestId(constantsTestid.animation.animationContainer)
    expect(animationContainer).toBeInTheDocument()
  })
})
