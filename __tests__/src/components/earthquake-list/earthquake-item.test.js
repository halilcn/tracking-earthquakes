import { render, screen } from '@testing-library/react'
import React from 'react'

import EarthquakeItem from '../../../../src/components/earthquake-list/earthquake-item'
import constantTestId from '../../../../src/constants/testid'
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

})
