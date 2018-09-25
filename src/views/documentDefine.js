import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Fetcher from '../tools/fetcher'
import { Row, Col } from 'reactstrap'
import Form from '../components/forms/form'
import Button from '../components/atoms/button'
import Loader from '../components/atoms/loader'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/views/view.css'

class DocumentDefine extends Component {
  state = {
    document: {
      asset_id: this.props.match.params.id,
      description: null,
      asset_offset: null,
      published: null,
      period_min: null,
      period_max: null,
      tags: []
    },
    loading: false,
    newID: null,
    saved: false
  }

  async handleSubmit () {
    const { document } = this.state
    this.setState({ loading: true })
    const data = await this.props.fetcher.defineDocument(document)
    this.setState({ loading: false })
    this.props.sendMessage(data.messages[0], !data.success)
    if (data.success) { 
      this.setState({ newID: data.data.document_id, saved: true })
    }
  }
  
  render () {
    const { id } = this.props.match.params
    const { document, loading, newID, saved } = this.state
    const title = 'Define a new document.'
    const body = 'Explain a few things about this document.'
    const formboxes = [
      { label: 'file', type: 'number', className: 'disabled', value: document.asset_id },
      { label: 'description', type: 'text', value: document.description, placeholder: 'a description of the document' }, 
      { label: 'date created', type: 'datetime-local', value: document.published, placeholder: 'the date it was created' }, 
      { label: 'starts at page', type: 'number', value: document.asset_offset, placeholder: 'the page it starts on' }, 
      { label: 'start date', type: 'datetime-local', value: document.period_min, placeholder: 'the start of the time period it covers' }, 
      { label: 'end date', type: 'datetime-local', value: document.period_max, placeholder: 'the end of the time period it covers' }, 
      { label: 'tags', type: 'linkbox', value: document.tags, placeholder: 'Start typing to add tags.', path: '../tags' }, 
    ]
    return (
      <div className='view'>
        {loading &&
          <div>
            <p className='preview-text'>Your document is being saved.</p>
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
              <Form 
                heading={title}
                body={body}
                formboxes={formboxes}
                disabled={saved}
                handleSubmit={() => this.handleSubmit()}
              />
            </Col>
          </Row>
        </div>
        {saved && newID &&
          <div className='saved-message'>
            <p className='preview-text'>Your document has been saved. What would you like to do?</p>
            <Button to={`/files/${id}/add`}>Define another document.</Button>
            <Button to={`/documents/${newID}`}>View this document.</Button>
            <Button to={`/files/${id}`}>View all documents for this file.</Button>
          </div>
        }
      </div>
    )
  }
}

DocumentDefine.propTypes = {
  fetcher: PropTypes.instanceOf(Fetcher).isRequired,
  sendMessage: PropTypes.func.isRequired
}

export default DocumentDefine
