import { useSelector } from 'react-redux'
import './index.scss'

const TrackTime = () => {
  const currentDate = useSelector(state => state.earthquake.animation.currentDate)

  return <div>{currentDate}</div>
}

export default TrackTime
