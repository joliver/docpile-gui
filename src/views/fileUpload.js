import React, { Component } from 'react'
import { Transition } from 'react-spring'
import { Row, Col } from 'reactstrap'
import FileViewer from 'react-file-viewer'
import Button from './../components/atoms/button'
import Loader from './../components/atoms/loader'
import flyer from './../assets/icons/flyer.svg'
import upload from './../assets/icons/upload.svg'
import success from './../assets/icons/success.svg'
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

  clearFile = () => {
    this.setState({ file: '', filePath: '', fileName: '', src: '', chosen: false })
  }

  chooseFile = (event) => {
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
  }

  uploadFile = () => {
    this.props.uploadFile(this.state.file)
  }

  render = () => {
    const { uploading } = this.props
    let items = []
    if (uploading) {
      items = [ { key: 0, component: loader() } ]
    } else {
      const { chosen, fileName, fileType, filePath, src } = this.state
      items = [ { key: 0, component: chooser({ chosen, filePath, fileName, chooseFile: this.chooseFile, clearFile: this.clearFile }) } ]
      if (chosen) {
        items.push( { key: 1, component: uploader({ src, fileType, uploadFile: this.uploadFile }) } )
      }
    }
    return (
      <Row>
        <Col xl='1' lg='1'></Col>
        <Col xl='5' lg='5' md='4' sm='12'>
          <img className='file-upload-image' src={flyer} alt='person flying a paper airplane' />
        </Col>
        <Col xl='5' lg='5' md='8' sm='12'>
          <Transition
            items={items}
            keys={item => item.key}
            from={{ opacity: 0 }}
            enter={[{ opacity: 1 }]}
            leave={[{ opacity: 0 }]}
            trail={300}
          >
            {item => styles => <span style={styles} children={item.component} />}
          </Transition>
        </Col>
        <Col xl='1' lg='1'></Col>
      </Row>
    )
  }
}

const loader = () => (
  <div className='table-view'>
    <p className='preview-text'>Your file is being uploaded.</p>
    <Loader /> 
  </div>
)

const chooser = (props) => (
  <span className='file-upload-chooser'>
    <h3 className='header'>Select a file to upload.</h3>
    <label htmlFor='file'>
      <Button
        cssLabel={props.chosen ? 'static' : 'submit'}
        label={props.chosen ? props.fileName : 'Choose File'}
        src={props.chosen ? success : upload}
        onClick={(event) => event.stopPropagation()}
      />
    </label>
    {props.filePath &&
      <input
        id='file'
        name='file'
        type='text'
        className='hidden-input'
        value={props.filePath}
        readOnly
        onClick={props.clearFile}
      />
    }
    {!props.filePath &&
      <input
        id='file'
        name='file'
        type='file'
        className='hidden-input'
        value={props.filePath}
        onChange={props.chooseFile}
      />
    }
  </span>
)

const uploader = (props) => (
  <span>
    {props.src && 
      <FileViewer filePath={props.src} fileType={props.fileType} />
    }
    <Button cssLabel='submit' label='Upload File' onClick={props.uploadFile} />
  </span>
)

export default FileUpload
