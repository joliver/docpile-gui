import React, { Component } from 'react'
import FileUpload from './fileUpload'
import DocDefine from './docDefine'
import DocAdd from './docAdd'
import './../css/views/view.css'

class Upload extends Component {
  state = {
    fileId: null,
    uploading: false, // uploading file (to server)
    uploaded: false, // file uploaded
    saving: false, // saving document (to server)
    saved: false // document saved
  }

  selectFile = (filePath) => {
    this.setState({ file: filePath })
  }

  testFileUpload = (filePath) => {
    const uploaded = !this.state.uploaded
    const fileId = this.state.fileId ? null : '123'
    this.setState({ fileId, uploaded })
  }
  
  async uploadFile (filePath) {
    this.setState({ uploading: true })
    const data = await this.props.fetcher.uploadAsset(filePath)
    this.setState({ uploading: false })
    this.props.sendMessage(data.messages[0], !data.success) 
    if (data.success) { 
      this.setState({ fileId: data.data.asset_id, uploaded: true })
    }
  }

  async saveDocument (document) {
    this.setState({ saving: true })
    const data = await this.props.fetcher.defineDocument(document)
    this.setState({ saving: false })
    this.props.sendMessage(data.messages[0], !data.success)
    if (data.success) { 
      this.setState({ saved: true })
    }
  }

  addAnother = () => {
    this.setState({ saved: false })
  }
  
  render () {
    const { uploading, uploaded, saving, saved, fileId } = this.state
    return (
      <div className='view'>
        {!uploaded && !saved &&
          <FileUpload uploading={uploading} selectFile={this.selectFile} uploadFile={this.testFileUpload} />
        }
        {!saved && uploaded &&
          <DocDefine fileId={fileId} saving={saving} saveDocument={this.saveDocument.bind(this)} />
        }
        {uploaded && saved &&
          <DocAdd fileId={fileId} addAnother={this.addAnother} />
        }
      </div>
    )
  }
}

export default Upload
