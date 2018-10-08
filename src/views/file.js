import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Fetcher from '../tools/fetcher'
import Loader from '../components/atoms/loader'
import FilePreview from './filePreview'
import FileDocuments from './fileDocuments'
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

  async loadDocuments () {
    this.setState({ saving: true })
    
    // pull the linked documents here

    this.setState({ saving: false })
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
    const { file, documents, loading, saving, defining } = this.state
    const loaded = file ? true : false
    return (
      <div className='view'>
        {loading &&
          <Loader /> 
        }
        {loaded &&
          <div className='file'>
            <FilePreview fileID={id} file={file} />
            {!saving && !defining &&
              <div>
                <FileDocuments documents={documents} />
                <div className='add-document' onClick={this.addDocument}>
                  Click here if you'd like to add another document to this file.
                </div>
              </div>        
            }
            {!saving && defining && 
              <DocDefine fileID={id} saving={saving} saveDocument={this.saveDocument.bind(this)} />
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

File.propTypes = {
  fetcher: PropTypes.instanceOf(Fetcher).isRequired,
  sendMessage: PropTypes.func.isRequired
}

export default File
