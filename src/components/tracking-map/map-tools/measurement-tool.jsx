import AreaMeasurementTool from './area-measurement-tool'
import DistanceMeasurementTool from './distance-measurement-tool'
import { MEASURE_TYPES } from './index'

const MeasurementTool = ({ type }) => {
  switch (type) {
    case MEASURE_TYPES.DISTANCE:
      return <DistanceMeasurementTool />
    case MEASURE_TYPES.AREA:
      return <AreaMeasurementTool />
    default:
      return null
  }
}

export default MeasurementTool
