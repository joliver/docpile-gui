import React from 'react'
import './../../css/navigation/message.css'

const MessageBox = (props) => {
  let isError = props.isError ? ' error' : ' success'
  let messageVisible = props.messageVisible ? 'message-box' : 'message-box hidden'
  let cssLabel = messageVisible + isError
  return (
    <div className={cssLabel}>
      <div className='message'>{props.message}</div>
      <div className='message-close-button' onClick={props.handleMessage}>&times;</div>
      <div className='clear'></div>
    </div>
  )
}

export default MessageBox