import dayjs from '../../src/utils/dayjs'

export const getKandilliMockEarthquake = payload => {
  const { newEarthquake = true } = payload || {}

  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [36.2873, 37.9515] },
    properties: {
      location_properties: {
        epiCenter: { name: 'test city name' },
      },
      source: 'kandilli',
      depth: 1,
      mag: 1,
      coordinates: [36.2873, 37.9515],
      earthquake_id: 1,
      title: 'test title',
      pointColor: '#fed9b1',
      pointSize: 5,
      date: newEarthquake ? dayjs().format() : dayjs().add(-2, 'days').format(),
      isNewEarthquake: newEarthquake,
    },
  }
}
