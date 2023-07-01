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

  test('should be rendered loading when there is still a request', () => {
    axios.get = jest.fn().mockReturnValue(
      new Promise(function () {
        setTimeout(() => {}, 3000)
      })
    )
    renderWithProviders(<AppContainer />)

    expect(screen.queryByTestId(constantsTestid.loading.loadingContainer)).toBeInTheDocument()
  })

  test('should be rendered error when there is an error', async () => {
    axios.get = jest.fn().mockReturnValue(Promise.reject('Error'))
    renderWithProviders(<AppContainer />)

    expect(await screen.findByTestId(constantsTestid.errorPage.errorPageContainer)).toBeInTheDocument()
  })

  /*
    test('should be rendered', async () => {
    axios.get = jest.fn().mockReturnValue({
      data: {
        metadata: {
          total: 0,
        },
        result: [getMockKandilliData()],
        features: [getMockUSGSData()],
      },
      status: 200,
    })
    renderWithProviders(<AppContainer />)

    // TODO:
    //expect(screen.queryByTestId(constantsTestid.loading.loadingContainer)).not.toBeInTheDocument()
    expect(await screen.findByTestId(testid.top)).toBeInTheDocument()
    //expect(await screen.findByTestId(testid.content)).toBeInTheDocument()
  })

  */
})
