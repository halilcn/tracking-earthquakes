import dayjs from '../../src/utils/dayjs'

export const getKandilliAPIResponseMock = payload => ({
  desc: '',
  httpStatus: 200,
  metadata: { total: 1 },
  result: [getKandilliAPIDataMock()],
  serverloadms: 45,
  status: true,
  ...payload,
})

export const getKandilliPreparedEarthquakeMock = payload => {
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

export const getUSGSAPIResponseMock = payload => ({
  bbox: [-179.9095, -58.9763, -2, 179.7911, 69.7104, 574.286],
  metdata: {
    generated: 1688220212000,
    url: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=1&starttime=2023-06-26&endtime=2023-07-01',
    title: 'USGS Earthquakes',
    status: 200,
    api: '1.14.0',
    count: 971,
  },
  type: 'FeatureCollection',
  features: [getUSGSAPIDataMock()],
  ...payload,
})

export const getUSGSAPIDataMock = payload => {
  const { newEarthquake = true } = payload || {}

  const time = newEarthquake ? dayjs().unix() : dayjs().add(-2, 'days').unix()

  return {
    type: 'Feature',
    properties: {
      time: time,
      updated: time,
      mag: 6.2,
      place: '86 km NE of Lime Village, Alaska',
      tz: null,
      url: 'https://earthquake.usgs.gov/earthquakes/eventpage/ak0237ofdzfq',
      detail: 'https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ak0237ofdzfq&format=geojson',
      felt: null,
      cdi: null,
      mmi: null,
      alert: null,
      status: 'automatic',
      tsunami: 0,
      sig: 22,
      net: 'ak',
      code: '0237ofdzfq',
      ids: ',ak0237ofdzfq,',
      sources: ',ak,',
      types: ',origin,phase-data,',
      nst: null,
      dmin: null,
      rms: 0.61,
      gap: null,
      magType: 'ml',
      type: 'earthquake',
      title: 'M 1.2 - 86 km NE of Lime Village, Alaska',
    },
    geometry: {
      type: 'Point',
      coordinates: [-154.1284, 61.8147, 5.7],
    },
    id: 'ak0237ofdzfq',
  }
}

export const getKandilliAPIDataMock = payload => {
  const { newEarthquake = true } = payload || {}

  const time = newEarthquake ? dayjs().format('YYYY.MM.DD HH:mm:ss') : dayjs().add(-2, 'days').format('YYYY.MM.DD HH:mm:ss')

  return {
    date: time,
    date_time: time,
    _id: '648b70dca44571c454bd4335',
    earthquake_id: 'JqTJ2lHqgW3wR',
    provider: 'kandilli',
    title: 'GURSU-CAMELI (DENIZLI)',
    mag: 6.9,
    depth: 10.9,
    geojson: { type: 'Point', coordinates: [29.3348, 36.9507] },
    location_properties: {
      closestCity: { name: 'Denizli', cityCode: 20, distance: 79804.0019693152, population: 1056332 },
      epiCenter: { name: 'Muğla', cityCode: 48, population: 1048185 },
      closestCities: [{ name: 'Isparta', cityCode: 32, distance: 169733.09714342176, population: 445325 }],
      airports: [
        {
          distance: 130416.25955991726,
          name: 'Antalya Havalimanı',
          code: 'AYT',
          coordinates: { type: 'Point', coordinates: [30.8005, 36.8987] },
        },
      ],
    },
    rev: null,
    created_at: 1686858869,
    location_tz: 'Europe/Istanbul',
  }
}
