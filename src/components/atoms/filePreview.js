import React, { Component } from 'react'
import { Document, Page } from 'react-pdf'
import Button from './button'
import './../../css/views/view.css'

class FilePreview extends Component {
  state = {
    preview: false
  }

  togglePreview = () => {
    this.setState({ preview: !this.state.preview })
  }

  render() {
    const previewClass = this.state.preview ? 'file-preview open' : 'file-preview closed'
    return (
      <div className='table-view file-view'>
        <h4 className='header'>File Preview</h4>
        <p className='description'>Take a look at a file and see the connected documents.</p>
        <div className={previewClass}>
          <Button label='Preview File' onClick={this.togglePreview} />
          {this.state.preview &&
            <Document file={this.props.file}>
              <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
          }
          <div className='clear'></div>
        </div>
      </div>
    )
  }
}

export default FilePreview
