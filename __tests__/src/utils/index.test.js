import { getCurrentLanguage } from "../../../src/utils"

describe('utils index', () => {
  test('deneme 1', () => {
     const test = getCurrentLanguage()
     console.log('asda', test);

     expect(true).toEqual(true)
  })
})
