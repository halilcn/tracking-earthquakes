import { useState } from 'react'
import React from 'react'
import { useSelector } from 'react-redux'

import constantsTestid from '../../../../constants/testid'
import ActionButtons from './action-buttons'
import FilterItems from './filter-items'
import './index.scss'
import TrackTime from './track-time'

const Animation = () => {
  const testid = constantsTestid.animation
  const isActiveAnimation = useSelector(state => state.earthquake.animation.currentDate)

  return (
    <div data-testid={testid.animationContainer} className="animation">
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
