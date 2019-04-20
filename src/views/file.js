import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Loader from '../components/atoms/loader'
import FilePreview from '../components/atoms/filePreview'
import Documents from './documents'
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

    // pull the file preview here (not yet supported by API)
    
    this.setState({ loading: false })
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
              <Documents {...this.props} fileId={id} />
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

export default withRouter(File)
