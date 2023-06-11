import { fireEvent, screen } from '@testing-library/react'
import React from 'react'

import EarthquakeItem from '../../../../src/components/earthquake-list/earthquake-item'
import constantTestId from '../../../../src/constants/testid'
import { initialState as earthquakeInitialState } from '../../../../src/store/earthquake'
import dayjs from '../../../../src/utils/dayjs'
import { renderWithProviders } from '../../../utils/renderWithProviders'

describe('earthquake item', () => {
  const testid = constantTestId.earthquakeItem

  test('should be rendered without having any problems', () => {
    const props = {
      index: 1,
      style: {},
      earthquake: {
        properties: {
          title: 'test',
          coordinates: [1, 1],
          isNewEarthquake: false,
          mag: 1,
          depth: 1,
          date: dayjs(),
        },
      },
      handleActionListDisable: jest.fn(),
    }
    renderWithProviders(<EarthquakeItem {...props} />)
    expect(screen.getByTestId(testid.itemContainer)).toBeInTheDocument()
  })

  test('should be rendered new earthquake icon when the isNewEarthquake prop is true', () => {
    const props = {
      index: 1,
      style: {},
      earthquake: {
        properties: {
          title: 'test',
          coordinates: [1, 1],
          isNewEarthquake: true,
          mag: 1,
          depth: 1,
          date: dayjs(),
        },
      },
      handleActionListDisable: () => {},
    }
    renderWithProviders(<EarthquakeItem {...props} />)

    expect(screen.queryByTestId(testid.newEarthquakeIcon)).toBeInTheDocument()
  })

  test('should be called function when clicking the button on a mobile device', () => {
    window.innerWidth = 1000

    const mockCallback = jest.fn()
    const props = {
      index: 1,
      style: {},
      earthquake: {
        properties: {
          title: 'test',
          coordinates: [1, 1],
          isNewEarthquake: false,
          mag: 1,
          depth: 1,
          date: dayjs(),
        },
      },
      handleActionListDisable: mockCallback,
    }
    renderWithProviders(<EarthquakeItem {...props} />, {
      preloadedState: { earthquake: { ...earthquakeInitialState, mapCurrent: { flyTo: () => {} } } },
    })

    fireEvent.click(screen.getByTestId(testid.itemButton))

    expect(mockCallback.mock.calls).toHaveLength(1)
  })

  test('should not be called function when clicking the button on a desktop device', () => {
    window.innerWidth = 1200

    const mockCallback = jest.fn()
    const props = {
      index: 1,
      style: {},
      earthquake: {
        properties: {
          title: 'test',
          coordinates: [1, 1],
          isNewEarthquake: false,
          mag: 1,
          depth: 1,
          date: dayjs(),
        },
      },
      handleActionListDisable: mockCallback,
    }
    renderWithProviders(<EarthquakeItem {...props} />, {
      preloadedState: { earthquake: { ...earthquakeInitialState, mapCurrent: { flyTo: () => {} } } },
    })

    fireEvent.click(screen.getByTestId(testid.itemButton))

    expect(mockCallback.mock.calls).toHaveLength(0)
  })
})
