import React, { Component } from 'react'
import config from '../tools/config'
import { Row, Col } from 'reactstrap'
import Form from './../components/forms/form'
import Loader from '../components/atoms/loader'
import Button from '../components/atoms/button'
import moment from 'moment'
import flying from './../assets/icons/flying.svg'
import success from './../assets/icons/success.svg'
import './../css/views/view.css'

class Document extends Component {
  state = {
    document: null,
    tags: null,
    loading: false
  }
  
  componentDidMount () {
    this.fetchDocument()
    this.fetchTags()
  }
  
  async fetchDocument () {
    const { id } = this.props.match.params
    this.setState({ loading: true })
    const data = await this.props.fetcher.getDocument(id)
    if (!data.success) { 
      this.props.sendMessage(data.messages[0], !data.success) 
    }
    else { 
      this.setState({ document: data.data, loading: false })
    }
  }

  async fetchTags () {
    this.setState({ loading: true })
    const data = await this.props.fetcher.getTags()
    if (!data.success) {
      this.props.sendMessage(data.messages[0], !data.success)
    } else {
      this.setState({ tags: data.data, loading: false})
    }
  }
  
  render () {
    const { document, tags, loading } = this.state
    const loaded = document && tags ? true : false

    const formboxes = (document && tags) ? [
      { label: 'document number', type: 'number', value: document.document_id, placeholder: 'no document number given' },
      { label: 'description', type: 'text', value: document.description, placeholder: 'no description given' },
      { label: 'starts at page', type: 'number', value: (document.asset_offset + 1), placeholder: 'no page offset given' }, 
      { label: 'date of upload', type: 'datetime-local', value: moment(document.timestamp).format(config.dateFormat), placeholder: 'no date given' },
      { label: 'date created', type: 'datetime-local', value: moment(document.published).format(config.dateFormat), placeholder: 'no date specified' }, 
      { label: 'start date', type: 'datetime-local', value: moment(document.period_min).format(config.dateFormat), placeholder: 'no start date given' }, 
      { label: 'end date', type: 'datetime-local', value: moment(document.period_max).format(config.dateFormat), placeholder: 'no end date given' }, 
      { label: 'list of tags', type: 'tagbox', value: document.tags, placeholder: 'no tags added', path: '../tags', tags: tags }, 
      // { label: 'list of subdocuments', type: 'linkbox', value: document.documents, placeholder: 'no subdocuments specified', path: '../documents' }
    ] : []
  
    return (
      <div className='table-view'>
        {loading &&
          <Loader /> 
        }
        {loaded &&
          <div>
            <h4 className='header'>View Document</h4>
            <p className='description'>View some information about a document.</p>
            <Row>
              <Col xl='2' lg='2' md='12' sm='12'>
                <img className='option-img' src={flying} alt='flying paper airplane' />
              </Col>
              <Col xl='1' lg='1'></Col>
              <Col xl='8' lg='8' md='12' sm='12'>
                <Form 
                  formboxes={formboxes}
                  disabled={true}
                  handleSubmit={ () => {} }
                />
                <Button cssLabel='inline' label='View connected file.' src={success} link={`/files/${document.asset_id}`} />
                <div className='clear'></div>
              </Col>
            </Row>
          </div>
        }
        {!loading && !loaded &&
          <p className='preview-text'>This document could not be displayed.</p>
        }
      </div>
    )
  }
}

export default Document
