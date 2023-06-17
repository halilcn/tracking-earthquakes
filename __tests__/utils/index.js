import { initialState as earthquakeInitialState } from '../../src/store/earthquake'

export const getEarthquakeState = customState => ({ ...earthquakeInitialState, ...customState })

export const getMockUSGSData = () => ({
  type: 'Feature',
  properties: {
    mag: 1.2,
    place: '86 km NE of Lime Village, Alaska',
    time: 1686927072765,
    updated: 1686927224763,
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
})

export const getMockKandilliData = () => ({
  _id: '648b70dca44571c454bd4335',
  earthquake_id: 'JqTJ2lHqgW3wR',
  provider: 'kandilli',
  title: 'GURSU-CAMELI (DENIZLI)',
  date: '2023.06.15 21:54:29',
  mag: 1.9,
  depth: 10.9,
  geojson: { type: 'Point', coordinates: [29.3348, 36.9507] },
  location_properties: {
    closestCity: { name: 'Denizli', cityCode: 20, distance: 79804.0019693152, population: 1056332 },
    epiCenter: { name: 'Muğla', cityCode: 48, population: 1048185 },
    closestCities: [
      { name: 'Denizli', cityCode: 20, distance: 79804.0019693152, population: 1056332 },
      { name: 'Burdur', cityCode: 15, distance: 86684.61497593891, population: 273799 },
      { name: 'Antalya', cityCode: 7, distance: 148996.49072981995, population: 2688004 },
      { name: 'Aydın', cityCode: 9, distance: 149917.61304638954, population: 1148241 },
      { name: 'Isparta', cityCode: 32, distance: 169733.09714342176, population: 445325 },
    ],
    airports: [
      {
        distance: 55022.67779048589,
        name: 'Dalaman Havalimanı',
        code: 'DLM',
        coordinates: { type: 'Point', coordinates: [28.7925, 36.7131] },
      },
      {
        distance: 98324.11157298813,
        name: 'Çardak Havalimanı',
        code: 'DNZ',
        coordinates: { type: 'Point', coordinates: [29.7013, 37.7856] },
      },
      {
        distance: 130416.25955991726,
        name: 'Antalya Havalimanı',
        code: 'AYT',
        coordinates: { type: 'Point', coordinates: [30.8005, 36.8987] },
      },
    ],
  },
  rev: null,
  date_time: '2023-06-15 21:54:29',
  created_at: 1686858869,
  location_tz: 'Europe/Istanbul',
})
