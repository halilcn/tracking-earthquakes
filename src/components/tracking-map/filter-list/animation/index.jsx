import ActionButtons from './action-buttons'
import FilterItems from './filter-items'
import TrackTime from './track-time'

import './index.scss'
import { useSelector } from 'react-redux'
import { useState } from 'react'

const Animation = () => {
  const isActiveAnimation = useSelector(state => state.earthquake.animation.currentDate)
  const [allEarthquakes, setAllEarthquakes] = useState([]) // TODO: render performance

  const handleSetAllEarthquakes = earthquakes => setAllEarthquakes(earthquakes)

  return (
    <div className="animation">
      <div className="animation__section">
        <FilterItems />
      </div>
      <div className="animation__section">
        <ActionButtons allEarthquakes={allEarthquakes} handleSetAllEarthquakes={handleSetAllEarthquakes} />
      </div>
      {isActiveAnimation && (
        <div className="animation__section">
          <TrackTime allEarthquakes={allEarthquakes} />
        </div>
      )}
    </div>
  )
}

export default Animation
