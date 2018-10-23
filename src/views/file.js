import React, { Component } from 'react'
import Loader from '../components/atoms/loader'
import FilePreview from './filePreview'
import Documents from './documents'
import DocDefine from './docDefine'
import './../css/views/view.css'

class File extends Component {
  state = {
    file: 'test-file', // test
    documents: [ 1, 2, 3, 4 ], // test
    loading: false, // loading file preview and document list
    saving: false, // saving new document or loading document list
    defining: false // adding new document
  }

  componentDidMount() {
    this.loadFile()
  }

  async loadFile () {
    this.setState({ loading: true })

    // pull the file preview here
    // pull linked documents here

    this.setState({ loading: false })
  }

  async saveDocument (document) {
    this.setState({ saving: true })
    const data = await this.props.fetcher.defineDocument(document)
    this.setState({ saving: false })
    this.props.sendMessage(data.messages[0], !data.success)
    if (data.success) { 
      this.setState({ defining: false })
      await this.loadDocuments()
    }
  }

  addDocument = () => {
    this.setState({ defining: true })
  }
    
  render () {
    const { id } = this.props.match.params
    const { file, loading, saving, defining } = this.state
    const loaded = file ? true : false
    return (
      <div className='table-view'>
        {loading &&
          <Loader /> 
        }
        {loaded &&
          <div className='file'>
            <FilePreview fileId={id} file={file} />
            {!saving && !defining &&
              <div>
                <Documents {...this.props} fileId={id} />
              </div>        
            }
            {!saving && defining && 
              <DocDefine fileId={id} saving={saving} saveDocument={this.saveDocument.bind(this)} />
            }
            {saving &&
              <Loader /> 
            }
          </div>
        }
        {!loading && !loaded &&
          <p className='preview-text'>Data about this file could not be displayed.</p>
        }
      </div>
    )
  }
}

export default File
