import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Fetcher from './../tools/fetcher'
import { Row, Col } from 'reactstrap'
import Button from '../components/atoms/button'
import Loader from '../components/atoms/loader'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/views/view.css'

class AssetUpload extends Component {
  state = {
    file: null,
    newID: null,
    loading: false,
    uploaded: false
  }

  testFileUpload = () => {
    const file = this.state.file ? null : 'test file'
    const uploaded = !this.state.uploaded
    const newID = this.state.newID ? null : '123'
    this.setState({ file, newID, uploaded })
  }
  
  async uploadAsset () {
    // const { file } = this.state
    this.setState({ loading: true })

    // placeholder test data
    // const data = await this.props.fetcher.uploadAsset(file)
    const data = { success: true, data: { asset_id: 123 }, message: [ 'File uploaded successfully.' ] }

    this.setState({ loading: false })
    this.props.sendMessage(data.messages[0], !data.success) 
    if (data.success) { 
      this.setState({ newID: data.data.asset_id, uploaded: true })
    }
  }
  
  render () {
    const { loading, uploaded, newID } = this.state
    return (
      <div className='view'>
        {loading &&
          <div>
            <p className='preview-text'>Your file is being uploaded.</p>
            <Loader /> 
          </div>
        }
        <div className='document'>
          <Row>
            <Col xl='3' lg='3' md='12' sm='12'>
              <img className='option-img' src={plane} alt='paper airplane' />
            </Col>
            <Col xl='1' lg='1'></Col>
            <Col xl='8' lg='8' md='12' sm='12'>
              <h3>Upload a file.</h3>
              <p className='preview-text'>File uploading placeholder.</p>
              <Button onClick={this.testFileUpload}>Upload File</Button>
            </Col>
          </Row>
        </div>
        {uploaded && newID &&
          <div className='saved-message'>
            <p className='preview-text'>Your file has been uploaded. What would you like to do?</p>
            <Button to={`/files/${newID}/add`}>Define a document in this file.</Button>
            <Button to={`/files/${newID}`}>View all data for this file.</Button>
          </div>
        }
      </div>
    )
  }
}

AssetUpload.propTypes = {
  fetcher: PropTypes.instanceOf(Fetcher).isRequired,
  sendMessage: PropTypes.func.isRequired
}

export default AssetUpload
