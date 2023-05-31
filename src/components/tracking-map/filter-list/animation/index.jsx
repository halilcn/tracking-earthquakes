import { useState } from 'react'
import { useSelector } from 'react-redux'

import ActionButtons from './action-buttons'
import FilterItems from './filter-items'
import './index.scss'
import TrackTime from './track-time'

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
