import { initialState as earthquakeInitialState } from '../../src/store/earthquake'

export const getEarthquakeState = customState => ({ ...earthquakeInitialState, ...customState })
