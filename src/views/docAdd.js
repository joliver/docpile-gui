import React from 'react'
import Button from '../components/atoms/button'
import './../css/views/view.css'

const DocAdd = (props) => (
  <div className='view'>
    <p>
      The document has been saved. Would you like to add another document to this file?
    </p>
    <Button label={'Yes, I\'d like to add another document.'} onClick={props.addAnother} />
    <Button label={'No, I\'m good.'} to={`/files/${props.fileId}`} />
  </div>
)

export default DocAdd
