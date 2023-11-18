import { useRef, useState } from 'react'

import MessageGeneralType from '../../../../../../public/message-types/ai.png'
import MessageEarthquakeType from '../../../../../../public/message-types/earthquake.png'
import useOnClickOutside from '../../../../../hooks/useOnClickOutside'
import './index.scss'

const ChattingAIMessageTypes = () => {
  const [isEnabledDropdown, setIsEnabledDropdown] = useState(true)

  const typesRef = useRef(null)

  useOnClickOutside(typesRef, () => {
    setIsEnabledDropdown(false)
  })

  const handleOnClickSelectedType = () => {
    setIsEnabledDropdown(prevIsEnabledDropdown => !prevIsEnabledDropdown)
  }

  const handleSelectType = type => () => {
    console.log('type', type)
    setIsEnabledDropdown(false)
  }

  console.log('rendered')

  return (
    <div ref={typesRef} className="chatting-message-types">
      <div onClick={handleOnClickSelectedType} className="chatting-message-types__selected-type">
        <img className="chatting-message-types__type-image" src={MessageGeneralType} />
      </div>
      <div className={`chatting-message-types__list ${isEnabledDropdown ? 'chatting-message-types__list--enabled' : ''}`}>
        <div
          onClick={handleSelectType('test-1')}
          data-description="desc 1qe qe weqweqe qweqweqweqw eqwe qw "
          className="chatting-message-types__item">
          <img className="chatting-message-types__type-image" src={MessageEarthquakeType} />
        </div>
        <div
          onClick={handleSelectType('test-2')}
          data-description="desc 2eq we qweqweqw xssadasd asd sa"
          className="chatting-message-types__item">
          <img className="chatting-message-types__type-image" src={MessageGeneralType} />
        </div>
      </div>
    </div>
  )
}

export default ChattingAIMessageTypes
