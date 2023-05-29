import { useState } from 'react'
import ActionButtons from './action-buttons'
import FilterItems from './filter-items'

import './index.scss'

const Animation = () => {
  return (
    <div className="animation">
      <div className="animation__section">
        <FilterItems />
      </div>
      <div className="animation__section">
        <ActionButtons />
      </div>
    </div>
  )
}

export default Animation
