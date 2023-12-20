import { render, screen } from '@testing-library/react'
import React from 'react'

import MapEarthquakePopup from '../../../../../src/components/tracking-map/map-popups/map-earthquake-popup'
import constantsTestid from '../../../../../src/constants/testid'

describe('map earthquake popup', () => {
  const testid = constantsTestid.mapEarthquakePopup
  const earthquakeProperties = {
    location_properties: {
      closestCity: {
        name: 'Burdur',
        cityCode: 15,
        distance: 27505.577158596418,
        population: 273799,
      },
      epiCenter: {
        name: 'Antalya',
        cityCode: 7,
        population: 2688004,
      },
      airports: [
        {
          distance: 83720.93929662221,
          name: 'Çardak Havalimanı',
          code: 'DNZ',
          coordinates: {
            type: 'Point',
            coordinates: [29.7013, 37.7856],
          },
        },
      ],
    },
    source: 'kandilli',
    depth: '5.00',
    mag: '3.5',
    date: '2023-07-09T17:35:28+03:00',
    coordinates: [30.1737, 37.1327],
    earthquake_id: 'jPLoqS9_wHTPF',
    title: 'AKYAR-KORKUTELI (ANTALYA)',
    isNewEarthquake: false,
    pointColor: '#ffad44',
    pointSize: 8,
  }

  test('should be rendered without having any errors', () => {
    render(<MapEarthquakePopup earthquake={earthquakeProperties} />)
    expect(screen.queryByTestId(testid.container)).toBeInTheDocument()
  })
})
