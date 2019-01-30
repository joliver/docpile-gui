import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import Form from './../components/forms/form'
import Loader from './../components/atoms/loader'
import flying from './../assets/icons/flying.svg'
import './../css/views/view.css'
import './../../node_modules/react-datepicker/dist/react-datepicker.css'

class DocDefine extends Component {
  state = {
    values: null
  }

  handleSubmit = values => {
    // save values to state in the event of an error
    this.setState({ values })
    const document = {
      asset_id: values['file number'],
      description: values['description'],
      asset_offset: parseInt(values['page number'], 10),
      published: values['date published'],
      period_min: values['start date'],
      period_max: values['end date'],
      tags: values['tags']
    }
    console.log('document to submit', document)
    this.props.saveDocument(document)
  }
  
  render () {
    const { saving, fileId } = this.props
    const { values } = this.state
    const title = 'Define a new document.'
    const body = 'Each file can hold one or more documents. Explain a few things about the first document in this file. After that, you can add more documents if needed.'
    const formboxes = [
      { label: 'file number', type: 'number', value: fileId },
      { label: 'description', type: 'text', placeholder: 'a description of the document' }, 
      { label: 'page number', type: 'number', placeholder: 'the page it starts' }, 
      { label: 'date published', type: 'date', placeholder: 'the date the document was published' }, 
      { label: 'start date', type: 'date', placeholder: 'the start of the time period it covers', comparison: 'max: end date' }, 
      { label: 'end date', type: 'date', placeholder: 'the end of the time period it covers', comparison: 'min: start date' }, 
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
                <img className='option-img' src={flying} alt='flying paper airplane' />
              </Col>
              <Col xl='1' lg='1'></Col>
              <Col xl='8' lg='8' md='12' sm='12'>
                <Form 
                  heading={title}
                  body={body}
                  formboxes={formboxes}
                  cancelable={true}
                  onCancel={this.props.goBack}
                  handleSubmit={this.handleSubmit}
                  submitLabel='Add'
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
