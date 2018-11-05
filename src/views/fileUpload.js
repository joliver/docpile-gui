import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import FileViewer from 'react-file-viewer'
import Button from './../components/atoms/button'
import Loader from './../components/atoms/loader'
import upload from './../assets/icons/upload.svg'
import success from './../assets/icons/success.svg'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/views/view.css'
import './../css/forms/form.css'

class FileUpload extends Component {
  state = {
    file: '',
    filePath: '',
    fileName: '',
    src: '',
    chosen: false, 
    loaded: false
  }

  chooseFile = (event) => {
    console.log(event.target.files[0])
    const filePath = event.target.value
    const file = event.target.files[0]
    const fileName = file.name
    const slashLocation = file.type.indexOf('/')
    const fileType = slashLocation > -1 ? file.type.slice(slashLocation + 1) : file.type
    this.setState({
      file,
      filePath,
      fileName,
      fileType,
      chosen: true,
      loaded: false
    })
    const reader = new FileReader()
    reader.onload = () => {
        this.setState({ 
            src: reader.result, 
            loaded: true 
        })
    }
    reader.readAsDataURL(file)
    this.props.selectFile(this.state.filePath)
  }

  uploadFile = () => {
    this.props.uploadFile(this.state.file)
  }

  render = () => {
    console.log(this.state.file)
    console.log(this.state.filePath)
    console.log(this.state.fileType)
    return (
      <div className='view file-upload'>
        {this.props.uploading &&
          <div>
            <p className='preview-text'>Your file is being uploaded.</p>
            <Loader /> 
          </div>
        }
        {!this.props.uploading &&
          <div>
            <Row>
              <Col xl='3' lg='3' md='12' sm='12'>
                <img className='option-img' src={plane} alt='paper airplane' />
              </Col>
              <Col xl='1' lg='1'></Col>
              <Col xl='8' lg='8' md='12' sm='12'>
                <div className='file-upload'>
                  <h3 className='header'>Select a file to upload.</h3>
                  <label htmlFor='file'>
                    <Button
                      cssLabel={this.state.chosen ? 'static' : 'submit'}
                      label={this.state.chosen ? this.state.fileName : 'Choose File'}
                      src={this.state.chosen ? success : upload}
                      onClick={(event) => event.stopPropagation()}
                    />
                  </label>
                  <input 
                    id='file'
                    name='file'
                    type='file'
                    className='hidden-input'
                    value={this.state.filePath}
                    onChange={this.chooseFile}
                  />
                  <div className='clear'></div>
                  {this.state.chosen &&
                    <span>
                      {this.state.src && 
                        <FileViewer filePath={this.state.src} fileType={this.state.fileType} />
                      }
                      <Button cssLabel='submit' label='Upload File' onClick={this.uploadFile} />
                    </span>
                  }
                </div>
              </Col>
            </Row>
          </div>
        }
      </div>
    )
  }
}

export default FileUpload
