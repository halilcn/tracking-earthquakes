import { fireEvent, screen } from '@testing-library/react'
import React from 'react'

import EarthquakeItem from '../../../../src/components/earthquake-list/earthquake-item'
import constantTestId from '../../../../src/constants/testid'
import dayjs from '../../../../src/utils/dayjs'
import { getEarthquakeState } from '../../../utils'
import { renderWithProviders } from '../../../utils/renderWithProviders'

describe('earthquake item', () => {
  const testid = constantTestId.earthquakeItem

  const mockEarthquake = {
    properties: {
      title: 'test',
      coordinates: [1, 1],
      isNewEarthquake: false,
      mag: 1,
      depth: 1,
      date: dayjs(),
    },
  }

  const mockDefaultProps = {
    index: 1,
    style: {},
    handleOnClickItem: jest.fn(),
    handleActionListDisable: jest.fn(),
    earthquake: mockEarthquake,
  }

  test('should be rendered without having any problems', () => {
    renderWithProviders(<EarthquakeItem {...mockDefaultProps} />)
    expect(screen.getByTestId(testid.itemContainer)).toBeInTheDocument()
  })

  test('should be rendered new earthquake icon when the isNewEarthquake prop is true', () => {
    const props = {
      ...mockDefaultProps,
      earthquake: {
        ...mockEarthquake,
        properties: {
          ...mockEarthquake.properties,
          isNewEarthquake: true,
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
      ...mockDefaultProps,
      handleActionListDisable: mockCallback,
    }
    renderWithProviders(<EarthquakeItem {...props} />, {
      preloadedState: { earthquake: getEarthquakeState({ mapCurrent: { flyTo: () => {} } }) },
    })

    fireEvent.click(screen.getByTestId(testid.itemButton))

    expect(mockCallback.mock.calls).toHaveLength(1)
  })

  test('should not be called function when clicking the button on a desktop device', () => {
    window.innerWidth = 1200

    const mockCallback = jest.fn()
    const props = {
      ...mockDefaultProps,
      handleActionListDisable: mockCallback,
    }
    renderWithProviders(<EarthquakeItem {...props} />, {
      preloadedState: { earthquake: getEarthquakeState({ mapCurrent: { flyTo: () => {} } }) },
    })

    fireEvent.click(screen.getByTestId(testid.itemButton))

    expect(mockCallback.mock.calls).toHaveLength(0)
  })

  test('should be called function when clicking the button', () => {
    const mockCallback = jest.fn()
    const props = {
      ...mockDefaultProps,
      handleOnClickItem: mockCallback,
    }
    renderWithProviders(<EarthquakeItem {...props} />, {
      preloadedState: { earthquake: getEarthquakeState({ mapCurrent: { flyTo: () => {} } }) },
    })

    fireEvent.click(screen.getByTestId(testid.itemButton))

    expect(mockCallback).toHaveBeenCalled()
  })
})
