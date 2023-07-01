import { fireEvent, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import React from 'react'

import ActionButtons from '../../../../../../src/components/tracking-map/filter-list/animation/action-buttons'
import { API } from '../../../../../../src/constants'
import constantsTestid from '../../../../../../src/constants/testid'
import { getKandilliAPIResponseMock, getUSGSAPIResponseMock } from '../../../../../mocks'
import mockAPI from '../../../../../utils/mockAPI'
import { renderWithProviders } from '../../../../../utils/renderWithProviders'

describe('action buttons', () => {
  const testid = constantsTestid.actionButtons
  const requests = [
    rest.get(`${API.KANDILLI}/kandilli/archive`, (_, res, ctx) => res(ctx.status(200), ctx.json(getKandilliAPIResponseMock()))),
    rest.get(API.USGS, (_, res, ctx) => res(ctx.status(200), ctx.json(getUSGSAPIResponseMock()))),
  ]

  mockAPI({ requests })

  test('should be rendered without any problems', () => {
    renderWithProviders(<ActionButtons />)
    expect(screen.queryByTestId(constantsTestid))
  })

  test('should be rendered stop button when the animation is started', async () => {
    renderWithProviders(<ActionButtons />)

    fireEvent.click(screen.getByTestId(testid.startButton))

    await waitFor(() => {
      expect(screen.queryByTestId(testid.stopButton)).toBeInTheDocument()
    })
  })

  test('should be rendered decide buttons when the animation is stopped', async () => {
    renderWithProviders(<ActionButtons />)

    fireEvent.click(screen.getByTestId(testid.startButton))
    fireEvent.click(await screen.findByTestId(testid.stopButton))

    await waitFor(() => {
      expect(screen.queryByTestId(testid.decideButtons)).toBeInTheDocument()
    })
  })

  test('should be rendered start button when the animation is cleared', async () => {
    renderWithProviders(<ActionButtons />)

    fireEvent.click(screen.getByTestId(testid.startButton))
    fireEvent.click(await screen.findByTestId(testid.stopButton))
    fireEvent.click(await screen.findByTestId(testid.clearButton))

    await waitFor(() => {
      expect(screen.queryByTestId(testid.startButton)).toBeInTheDocument()
    })
  })

  test('should be rendered stop button when clicked continue button', async () => {
    renderWithProviders(<ActionButtons />)

    fireEvent.click(screen.getByTestId(testid.startButton))
    fireEvent.click(await screen.findByTestId(testid.stopButton))
    fireEvent.click(await screen.findByTestId(testid.continueButton))

    await waitFor(() => {
      expect(screen.queryByTestId(testid.stopButton)).toBeInTheDocument()
    })
  })
})
