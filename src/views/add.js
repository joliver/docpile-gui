import React from 'react'
import { withRouter } from 'react-router-dom'
import Button from '../components/atoms/button'
import './../css/views/view.css'

const Add = props => (
  <div className='view'>
    <h4 className='header'>Add Documents</h4>
    <div className='description'>
      That document has been saved for this file. Would you like to add another document?
    </div>
    <Button 
      className='narrative'
      label={'Yes, I\'d like to add another document.'}
      link={`/uploaded/${props.match.params.fileId}`}
    />
    <Button 
      className='narrative'
      label={'Hmm... I\'d like to look at the document I just defined.'}
      link={`/documents/${props.match.params.documentId}`}
    />
    <Button 
      className='narrative'
      label={'No thanks, I\'m good. Send me to look at the file.'}
      link={`/files/${props.match.params.fileId}`} 
    />
  </div>
)

export default withRouter(Add)
