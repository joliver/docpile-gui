import React from 'react'
import Button from './../components/atoms/button'
import './../css/views/view.css'

const FilePreview = (props) => {
  return (
    <div className='view'>
      <h4 className='title'>File #{props.fileID}</h4>
      <p className='preview-text'>View this file and see a list of connected documents.</p>
      <Button label='Preview File' onClick={() => {}} />
    </div>
  )
}

export default FilePreview
