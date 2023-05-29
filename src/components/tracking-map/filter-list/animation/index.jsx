import ActionButtons from './action-buttons'
import FilterItems from './filter-items'
import TrackTime from './track-time'

import './index.scss'
import { useSelector } from 'react-redux'

const Animation = () => {
  const isActiveAnimation = useSelector(state => state.earthquake.animation.currentDate)

  return (
    <div className="animation">
      <div className="animation__section">
        <FilterItems />
      </div>
      <div className="animation__section">
        <ActionButtons />
      </div>
      {isActiveAnimation && (
        <div className="animation__section">
          <TrackTime />
        </div>
      )}
    </div>
  )
}

export default Animation
