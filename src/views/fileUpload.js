import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import Button from './../components/atoms/button'
import Loader from './../components/atoms/loader'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/forms/form.css'

class FileUpload extends Component {
  state = {
    filePath: '',
    chosen: false
  }

  chooseFile = () => {
    // choose file to upload placeholder

    this.setState({ filePath: 'filepath', chosen: true })
    this.props.selectFile(this.state.filePath)
  }

  uploadFile = () => {
    this.props.uploadFile(this.state.filePath)
  }

  render = () => (
    <div className='view'>
      {this.props.uploading &&
        <div>
          <p className='preview-text'>Your file is being uploaded.</p>
          <Loader /> 
        </div>
      }
      {!this.props.uploading &&
        <div className='documents'>
          <Row>
            <Col xl='3' lg='3' md='12' sm='12'>
              <img className='option-img' src={plane} alt='paper airplane' />
            </Col>
            <Col xl='1' lg='1'></Col>
            <Col xl='8' lg='8' md='12' sm='12'>
              <div className='form form-box'>
                <h3 className='heading'>Select a file to upload.</h3>
                <input 
                  type='text' 
                  className='input'
                  value={this.state.filePath}
                  placeholder='choose a file'
                />
                {!this.state.chosen &&
                  <Button className='button submit' label='Choose File' onClick={this.chooseFile} />
                }
                {this.state.chosen &&
                  <Button className='button submit' label='Upload File' onClick={this.uploadFile} />
                }
              </div>
            </Col>
          </Row>
        </div>
      }
    </div>
  )
}

export default FileUpload
