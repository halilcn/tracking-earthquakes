export default () => {
  const mockValue = () => {
    let store = {}
    return {
      ...store,
    }
  }

  Object.defineProperty(global, 'mapboxgl', { value: mockValue() })

  class MapClass {
    constructor() {}
    on() {}
    getSource() {}
  }

  class MarkerClass {
    constructor() {}
  }

  global.mapboxgl.Map = MapClass
  global.mapboxgl.Marker = MarkerClass
  global.mapboxgl.accessToken = ''
}
