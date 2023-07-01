import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import React from 'react'

import ActionList, { CONTENT_TYPES } from '../../../../../src/components/tracking-map/action-list'
import constantsTestid from '../../../../../src/constants/testid'
import { LOCAL_STORAGE_KEYS } from '../../../../../src/utils/localStorageActions'
import localStorageMock from '../../../../mocks/localStorageMock'
import { renderWithProviders } from '../../../../utils/renderWithProviders'

describe('action list', () => {
  const testid = constantsTestid.actionList

  beforeAll(() => localStorageMock())
  beforeEach(() => window.localStorage.clear())

  test('should be rendered without any problems', () => {
    renderWithProviders(<ActionList />)
    expect(screen.queryByTestId(testid.listContainer)).toBeInTheDocument()
  })

  test('should be rendered correct content according to selected item', () => {
    renderWithProviders(<ActionList />)

    const listContent = within(screen.getByTestId(testid.content))

    fireEvent.click(screen.getByTestId(testid.earthquakeListItem))
    expect(listContent.queryByTestId(constantsTestid.earthquakeList.listContainer)).toBeInTheDocument()

    fireEvent.click(screen.getByTestId(testid.searchItem))
    expect(listContent.queryByTestId(constantsTestid.search.searchContainer)).toBeInTheDocument()
  })

  test('should be disabled when clicked on disable content button', async () => {
    renderWithProviders(<ActionList />)

    fireEvent.click(screen.getByTestId(testid.earthquakeListItem))
    fireEvent.click(screen.getByTestId(testid.disableContent))

    await waitFor(() => {
      expect(screen.getByTestId(testid.content)).toHaveStyle('opacity: 0;')
    })
  })

  test('should be enabled and rendered correct content according to the data that were stored on local storage', async () => {
    window.localStorage.setItem(LOCAL_STORAGE_KEYS.LEFT_PANEL_STATUS, 'true')
    window.localStorage.setItem(LOCAL_STORAGE_KEYS.LEFT_PANEL_TYPE, CONTENT_TYPES.EARTHQUAKE_LIST)
    renderWithProviders(<ActionList />)

    const listContent = within(screen.getByTestId(testid.content))
    await waitFor(() => {
      expect(screen.getByTestId(testid.content)).toHaveStyle('opacity: 1;')
      expect(listContent.queryByTestId(constantsTestid.earthquakeList.listContainer)).toBeInTheDocument()
    })
  })
})
