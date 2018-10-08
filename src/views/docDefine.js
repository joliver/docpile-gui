import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import Form from './../components/forms/form'
import Loader from './../components/atoms/loader'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/views/view.css'

class DocDefine extends Component {
  handleSubmit = (document) => {
    this.props.saveDocument(document)
  }
  
  render () {
    const { saving, fileID } = this.props
    const title = 'Define a new document.'
    const body = 'Each file can hold one or more documents. Explain a few things about the first document in this file. After that, you can add more documents if needed.'
    const formboxes = [
      { label: 'file', type: 'number', className: 'disabled', value: fileID },
      { label: 'description', type: 'text', placeholder: 'a description of the document' }, 
      { label: 'page number', type: 'number', placeholder: 'the page it starts' }, 
      { label: 'date published', type: 'datetime-local', placeholder: 'the date the document was published' }, 
      { label: 'start date', type: 'datetime-local', placeholder: 'the start of the time period it covers' }, 
      { label: 'end date', type: 'datetime-local', placeholder: 'the end of the time period it covers' }, 
      { label: 'tags', type: 'linkbox', placeholder: 'Start typing to add tags.', path: '../tags' }, 
    ]
    return (
      <div className='view'>
        {saving &&
          <div>
            <p className='preview-text'>Your document is being saved.</p>
            <Loader /> 
          </div>
        }
        {!saving &&
          <div className='document'>
            <Row>
              <Col xl='3' lg='3' md='12' sm='12'>
                <img className='option-img' src={plane} alt='paper airplane' />
              </Col>
              <Col xl='1' lg='1'></Col>
              <Col xl='8' lg='8' md='12' sm='12'>
                <Form 
                  heading={title}
                  body={body}
                  formboxes={formboxes}
                  handleSubmit={this.handleSubmit}
                />
              </Col>
            </Row>
          </div>
        }
      </div>
    )
  }
}

export default DocDefine
