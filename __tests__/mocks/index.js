import dayjs from '../../src/utils/dayjs'

export const getMockNewEarthquake = () => ({
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [36.2873, 37.9515] },
  properties: {
    location_properties: {
      epiCenter: { name: 'test city name' },
    },
    source: 'kandilli',
    depth: 1,
    mag: 1,
    date: dayjs().format(),
    coordinates: [36.2873, 37.9515],
    earthquake_id: 1,
    title: 'test title',
    isNewEarthquake: true,
    pointColor: '#fed9b1',
    pointSize: 5,
  },
})
