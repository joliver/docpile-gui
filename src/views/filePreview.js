import React from 'react'
import Button from './../components/atoms/button'
import './../css/views/view.css'

const FilePreview = (props) => {
  return (
    <div className='table-view file-preview'>
      <h4 className='header'>File #{props.fileId}</h4>
      <p className='description'>View this file and see a list of connected documents.</p>
      <Button cssLabel='submit' label='Preview File' onClick={() => {}} />
      <div className='clear'></div>
    </div>
  )
}

export default FilePreview
