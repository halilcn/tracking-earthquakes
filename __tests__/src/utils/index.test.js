import { getCurrentLanguage } from '../../../src/utils/index'
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
})
