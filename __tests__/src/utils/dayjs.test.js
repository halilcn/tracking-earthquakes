import { LOCAL_STORAGE_KEYS } from '../../../src/utils/localStorageActions'
import localStorageMock from '../../mocks/localStorageMock'
import navigatorMock from '../../mocks/navigatorMock'

// TODO: we should add more tests related to dayjs
describe('dayjs', () => {
  beforeAll(() => {
    localStorageMock()
    navigatorMock()
  })
  beforeEach(() => {
    window.localStorage.clear()
    global.navigator.clearMocks()
  })

  test('should be the language that was stored if there is', async () => {
    window.localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, 'tr-TR')
    const { customDayjs } = await import('../../../src/utils/dayjs.js')

    expect(customDayjs.locale()).toEqual('tr')
  })
})
