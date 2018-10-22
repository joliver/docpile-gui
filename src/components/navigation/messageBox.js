import React from 'react'
import PropTypes from 'prop-types'
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

MessageBox.propTypes = {
  isError: PropTypes.bool.isRequired,
  messageVisible: PropTypes.bool.isRequired,
  message: PropTypes.string, // is required, but can also be null, so not listed as isRequired
  handleMessage: PropTypes.func.isRequired
}

export default MessageBox