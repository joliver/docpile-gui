import React, { Component } from 'react'
import { Transition } from 'react-spring'
import FileUpload from './fileUpload'
import DocDefine from './docDefine'
import DocAdd from './docAdd'
import './../css/views/view.css'

class Upload extends Component {
  state = {
    file: '',
    fileId: null,
    uploading: false, // uploading file (to server)
    uploaded: false, // file uploaded
    saving: false, // saving document (to server)
    saved: false // document saved
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

  goBack = () => {
    this.setState({ uploaded: false })
  }
  
  render () {
    const { uploading, uploaded, saving, saved, fileId } = this.state
    let item = '';
    if (!uploaded && !saved) {
      item = <FileUpload uploading={uploading} uploadFile={this.testFileUpload} />
    } else if (!saved && uploaded) {
      item = <DocDefine fileId={fileId} saving={saving} goBack={this.goBack} saveDocument={this.saveDocument.bind(this)} />
    } else if (uploaded && saved) {
      item = <DocAdd fileId={fileId} addAnother={this.addAnother} />
    }
    return (
      <div className='view'>
        <Transition
          items={item}
          from={{ opacity: 0, height: 0, }}
          enter={[{ opacity: 1, height: 'auto' }]}
          leave={[{ opacity: 0, height: 0 }]}
        >
          {item => props => <div style={props} className="upload-transition" children={item} />}
        </Transition>
      </div>
    )
  }
}

export default Upload
