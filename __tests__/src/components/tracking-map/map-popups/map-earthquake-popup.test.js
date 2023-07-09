import { render, screen } from '@testing-library/react'
import React from 'react'

import MapEarthquakePopup from '../../../../../src/components/tracking-map/map-popups/map-earthquake-popup'
import constantsTestid from '../../../../../src/constants/testid'
import { URL_QUERY_PARAMS } from '../../../../../src/utils/queryParamsActions'

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

  test('should be have all query parameters of share buttons', () => {
    render(<MapEarthquakePopup earthquake={earthquakeProperties} />)

    const twitterShareButton = screen.getByTestId(testid.twitterShareButton)
    const whatsappShareButton = screen.getByTestId(testid.whatsappShareButton)

    expect(twitterShareButton.href).toContain(URL_QUERY_PARAMS.LAT_LONG)
    expect(twitterShareButton.href).toContain(URL_QUERY_PARAMS.PAST_EARTHQUAKE_DATES)
    expect(twitterShareButton.href).toContain(URL_QUERY_PARAMS.EARTHQUAKE_ID)

    expect(whatsappShareButton.href).toContain(URL_QUERY_PARAMS.LAT_LONG)
    expect(whatsappShareButton.href).toContain(URL_QUERY_PARAMS.PAST_EARTHQUAKE_DATES)
    expect(whatsappShareButton.href).toContain(URL_QUERY_PARAMS.EARTHQUAKE_ID)
  })
})
