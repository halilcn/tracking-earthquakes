import { screen } from '@testing-library/react'
import axios from 'axios'
import React from 'react'

import AppContainer from '../../../../src/components/app-container'
import constantsTestid from '../../../../src/constants/testid'
import { renderWithProviders } from '../../../utils/renderWithProviders'

describe('app container', () => {
  const testid = constantsTestid.appContainer

  beforeAll(() => {
    jest.mock('axios')
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should be rendered without having any errors', () => {
    axios.get = jest.fn().mockReturnValue({
      data: {},
      status: 200,
    })
    renderWithProviders(<AppContainer />)

    expect(screen.queryByTestId(testid.appContainer)).toBeInTheDocument()
  })


  test('should be rendered error when there is an error', async () => {
    axios.get = jest.fn().mockReturnValue(Promise.reject('Error'))
    renderWithProviders(<AppContainer />)

    expect(await screen.findByTestId(constantsTestid.errorPage.errorPageContainer)).toBeInTheDocument()
  })
})
