import React from 'react'
import './../css/views/view.css'

const FileDocuments = (props) => {
  const docs = props.documents.map((doc) => JSON.stringify(doc))
  return (
    <div className='view'>
      {docs}
    </div>
  )
}

export default FileDocuments
