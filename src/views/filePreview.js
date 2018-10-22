import React from 'react'
import Button from './../components/atoms/button'
import './../css/views/view.css'

const FilePreview = (props) => {
  return (
    <div className='view'>
      <h4 className='title'>File #{props.fileId}</h4>
      <p className='preview-text'>View this file and see a list of connected documents.</p>
      <Button cssLabel='submit' label='Preview File' onClick={() => {}} />
    </div>
  )
}

export default FilePreview
