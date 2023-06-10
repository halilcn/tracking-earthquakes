import { earthquakeDataStructure, getCurrentLanguage } from '../../../src/utils/index'
import { setLanguage } from '../../../src/utils/localStorageActions'
import localStorageMock from '../../mocks/localStorageMock'
import navigatorMock from '../../mocks/navigatorMock'

describe('utils index', () => {
  describe('getCurrentLanguage', () => {
    beforeAll(() => {
      localStorageMock()
      navigatorMock()
    })

    beforeEach(() => {
      window.localStorage.clear()
      global.navigator.clearMocks()
    })

    test('should be the language that was stored when there is stored language', () => {
      const data = 'en-US'
      setLanguage(data)
      expect(getCurrentLanguage()).toEqual(data)
    })

    test('should be the browser language when there is not stored language', () => {
      const data = 'tr-TR'
      global.navigator.language = data
      expect(getCurrentLanguage()).toEqual(data)
    })
  })

  describe('earthquakeDataStructure', () => {
    test('should be default value when having missing items', () => {
      const data = {
        depth: 1,
        mag: 1,
        date: '01-01-2023',
        coordinates: [32, 29],
        earthquake_id: 1,
        title: 'test',
        isNewEarthquake: true,
        pointColor: 'red',
        pointSize: 1,
      }
      const resData = earthquakeDataStructure(data)

      expect(resData.properties.location_properties).toBeDefined()
      expect(resData.properties.location_properties.epiCenter).toBeDefined()
      expect(resData.properties.source).toBeDefined()
    })

    test('should be contain earthquake data in the properties', () => {
      const data = {
        source: 'test',
        depth: 1,
        mag: 1,
        date: '01-01-2023',
        coordinates: [32, 29],
        earthquake_id: 1,
        location_properties: {},
        title: 'test',
        isNewEarthquake: true,
        pointColor: 'red',
        pointSize: 1,
      }

      expect(earthquakeDataStructure(data).properties).toMatchObject(data)
    })
  })
})
