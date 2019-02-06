import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Transition } from 'react-spring'
import { Row, Col } from 'reactstrap'
import FileViewer from 'react-file-viewer'
import Button from './../components/atoms/button'
import Loader from './../components/atoms/loader'
import flyer from './../assets/icons/flyer.svg'
import upload from './../assets/icons/upload.svg'
import success from './../assets/icons/success.svg'
import './../css/views/view.css'

class Upload extends Component {
  state = {
    file: '',
    filePath: '',
    fileName: '',
    src: '',
    chosen: false, 
    loaded: false,
    uploading: false
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
  
  handleUpload = () => {
    this.uploadFile(this.state.file)
  }

  async uploadFile (file) {
    this.setState({ uploading: true })
    const data = await this.props.fetcher.uploadAsset(file)
    this.setState({ uploading: false })
    this.props.sendMessage(data.messages[0], !data.success) 
    if (data.success) {
      const fileId = data.data.asset_id
      this.props.history.push(`/uploaded/${fileId}`)
    }
  }
  
  loader = () => (
    <div className='table-view'>
      <p className='preview-text'>Your file is being uploaded.</p>
      <Loader /> 
    </div>
  )
  
  chooser = props => (
    <span className='file-upload-chooser' key={props.filePath}>
      <h3 className='header secondary-header'>Select a file to upload.</h3>
      <label htmlFor='file'>
        <Button
          className={props.chosen ? 'static' : 'submit'}
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
  
  uploader = props => (
    <span>
      {props.src && 
        <FileViewer filePath={props.src} fileType={props.fileType} />
      }
      <Button className='submit' label='Upload File' onClick={props.uploadFile} />
    </span>
  )

  render = () => {
    const { uploading } = this.state
    let items = []
    if (uploading) {
      items = [ { key: 0, component: this.loader() } ]
    } else {
      const { chosen, fileName, fileType, filePath, src } = this.state
      items = [ { key: 0, component: this.chooser({ chosen, filePath, fileName, chooseFile: this.chooseFile, clearFile: this.clearFile }) } ]
      if (chosen) {
        items.push( { key: 1, component: this.uploader({ src, fileType, uploadFile: this.handleUpload }) } )
      }
    }
    return (
      <Row>
        <Col xl='2' lg='1'></Col>
        <Col xl='3' lg='4' md='4' sm='12'>
          <img className='file-upload-image' src={flyer} alt='person flying a paper airplane' />
        </Col>
        <Col xl='5' lg='6' md='8' sm='12'>
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
        <Col xl='2' lg='1'></Col>
      </Row>
    )
  }
}
  
export default withRouter(Upload)
