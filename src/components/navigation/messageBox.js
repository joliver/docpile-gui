import React from 'react'
import { Transition } from 'react-spring'
import './../../css/navigation/message.css'

const MessageBox = props => (
  <Transition
    items={props.messages.map(msg => Message(msg, props))}
    keys={msg => msg.key}
    from={{ opacity: 0, transform: 'translate3d(0,-60px,0)' }}
    enter={{ opacity: 1, transform: 'translate3d(0,0px,0)' }}
    leave={{ opacity: 0, transform: 'translate3d(0,-60px,0)'}}
    trail={400}
  >
    {msg => styles =>
      <div style={styles} className="message-box-transition">{msg.component}</div>
    }
  </Transition>
)

const Message = (msg, props) => {
  const { key, message, isError } = msg
  const component = (
    <div className={isError ? 'message-box error' : 'message-box success'}>
      <div className='message'>{message}</div>
      <div className='message-close-button' onClick={props.makeMessageCloser(key)}>&times;</div>
      <div className='clear'></div>
    </div>
  )
  return ({ key, component })
}

export default MessageBox