import {
  getLanguage,
  getLeftPanelStatus,
  getMapType,
  setLanguage,
  setLeftPanelStatus,
  setMapType,
} from '../../../src/utils/localStorageActions.js'
import localStorageMock from '../../mocks/localStorageMock'

describe('local storage actions', () => {
  beforeAll(() => localStorageMock())
  beforeEach(() => window.localStorage.clear())

  test('left panel status', () => {
    const data = true
    setLeftPanelStatus(data)
    expect(getLeftPanelStatus()).toEqual(data)
  })

  test('map type', () => {
    const data = 'test-type'
    setMapType(data)
    expect(getMapType()).toEqual(data)
  })

  test('language', () => {
    const data = 'tr'
    setLanguage(data)
    expect(getLanguage()).toEqual(data)
  })
})
