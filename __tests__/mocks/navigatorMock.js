export default () => {
  const mockValue = () => {
    let store = {}
    return {
      ...store,
      clearMocks() {
        store = {}
      },
    }
  }
  Object.defineProperty(global, 'navigator', { value: mockValue() })
}
