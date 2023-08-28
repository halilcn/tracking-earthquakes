import { screen } from '@testing-library/react'
import React from 'react'

import ChooseLanguage from '../../../../../../../src/components/tracking-map/filter-list/settings/choose-language'
import { LANGUAGES } from '../../../../../../../src/constants'
import constantsTestid from '../../../../../../../src/constants/testid'
import { LOCAL_STORAGE_KEYS } from '../../../../../../../src/utils/localStorageActions'
import localStorageMock from '../../../../../../mocks/localStorageMock'
import { renderWithProviders } from '../../../../../../utils/renderWithProviders'

describe('choose language', () => {
  const testid = constantsTestid.chooseLanguage

  beforeAll(() => localStorageMock())
  beforeEach(() => window.localStorage.clear())

  test('should be rendered without having any problems', () => {
    renderWithProviders(<ChooseLanguage />)
    expect(screen.queryByTestId(testid.container)).toBeInTheDocument()
  })

  test('should be rendered without having any problems', () => {
    renderWithProviders(<ChooseLanguage />)

    const dropdownButton = screen.getByRole('button')
    expect(dropdownButton).toHaveTextContent(LANGUAGES['en-US'])
  })
})
