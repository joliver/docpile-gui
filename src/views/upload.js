import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Fetcher from '../tools/fetcher'
import FileUpload from './fileUpload'
import DocDefine from './docDefine'
import DocAdd from './docAdd'
import './../css/views/view.css'

class Upload extends Component {
  state = {
    fileID: null,
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
    const fileID = this.state.fileID ? null : '123'
    this.setState({ fileID, uploaded })
  }
  
  async uploadFile (filePath) {
    this.setState({ uploading: true })
    const data = await this.props.fetcher.uploadAsset(filePath)
    this.setState({ uploading: false })
    this.props.sendMessage(data.messages[0], !data.success) 
    if (data.success) { 
      this.setState({ fileID: data.data.asset_id, uploaded: true })
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
    const { uploading, uploaded, saving, saved, fileID } = this.state
    return (
      <div className='view'>
        {!uploaded && !saved &&
          <FileUpload uploading={uploading} selectFile={this.selectFile} uploadFile={this.testFileUpload} />
        }
        {!saved && uploaded &&
          <DocDefine fileID={fileID} saving={saving} saveDocument={this.saveDocument.bind(this)} />
        }
        {uploaded && saved &&
          <DocAdd fileID={fileID} addAnother={this.addAnother} />
        }
      </div>
    )
  }
}

Upload.propTypes = {
  fetcher: PropTypes.instanceOf(Fetcher).isRequired,
  sendMessage: PropTypes.func.isRequired
}

export default Upload
