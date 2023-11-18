import MessageGeneralType from '../../../../../public/message-types/ai.png'
import MessageEarthquakeType from '../../../../../public/message-types/earthquake.png'
import './index.scss'

const ChattingAIMessages = () => {
  return (
    <div className="chatting-messages">
      {[1, 2, 3, 4].map(id => (
        <>
          <div className="chatting-messages__item chatting-messages__item--ai">
            <div className="chatting-messages__content">
              message item were wrew rwe rwer wqwewq ewqeqeqwe qwe qweq eqweqw eqwe qwe qwe qeqw eqweq e qwe qwe qwe wqeqw ewq wqerwe rwe
              rwe rwer ewr wer weqe qwe wqewq ewqe qwe qwe qweqw qwe
            </div>
          </div>
          <div className="chatting-messages__item chatting-messages__item--me">
            <div className="chatting-messages__content">
              message itemmessage itemmessage itemmessage itemmessage itemmessage itemmessage itemmessage itemmessage itemmessage item
            </div>
            <div className="chatting-messages__info">
              <div className="chatting-messages__info-item">
                <div className="chatting-messages__info-title">Type:</div>
                <div className="chatting-messages__info-content">
                  <img src={MessageGeneralType} className="chatting-messages__message-type-img" />
                </div>
              </div>
              <div className="chatting-messages__info-item">
                <div className="chatting-messages__info-title">Selected Date:</div>
                <div className="chatting-messages__info-content">12-12-2023</div>
              </div>
            </div>
          </div>
        </>
      ))}
    </div>
  )
}

export default ChattingAIMessages
