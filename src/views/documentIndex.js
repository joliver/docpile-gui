import React from 'react'
import DocumentList from './documentList'
import Document from './document'
import './../css/views/view.css'

const DocumentIndex = (props) => {
    console.log(props.id)
    console.log(props.match.params.id)
    return props.id ? <Document {...props} /> : <DocumentList {...props} />
}

export default DocumentIndex
