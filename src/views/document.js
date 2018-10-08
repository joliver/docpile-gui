import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Fetcher from './../tools/fetcher'
import config from '../tools/config'
import { Row, Col } from 'reactstrap'
import Form from './../components/forms/form'
import Loader from '../components/atoms/loader'
import moment from 'moment'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/views/view.css'

class Document extends Component {
  state = {
    document: null,
    loading: false
  }
  
  componentDidMount () {
    this.fetchDocument()
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
  
  render () {
    const { document, loading } = this.state
    const title = document ? `Document #${document.document_id}` : ''
    const loaded = document ? true : false

    const formboxes = document ? [
      { label: 'file', type: 'number', value: document.asset_id, placeholder: 'no file specified' },
      { label: 'date of upload', type: 'datetime-local', value: moment(document.timestamp).format(config.dateFormat), placeholder: 'no date given' },
      { label: 'date created', type: 'datetime-local', value: moment(document.published).format(config.dateFormat), placeholder: 'no date specified' }, 
      { label: 'starts at page', type: 'number', value: (document.asset_offset + 1), placeholder: 'no page offset given' }, 
      { label: 'start date', type: 'datetime-local', value: moment(document.period_min).format(config.dateFormat), placeholder: 'no start date given' }, 
      { label: 'end date', type: 'datetime-local', value: moment(document.period_max).format(config.dateFormat), placeholder: 'no end date given' }, 
      { label: 'list of tags', type: 'linkbox', value: document.tags, placeholder: 'no tags added', path: '../tags' }, 
      { label: 'list of subdocuments', type: 'linkbox', value: document.documents, placeholder: 'no subdocuments specified', path: '../documents' }
    ] : []
  
    return (
      <div className='view'>
        {loading &&
          <Loader /> 
        }
        {loaded &&
          <div className='document'>
            <Row>
              <Col xl='3' lg='3' md='12' sm='12'>
                <img className='option-img' src={plane} alt='paper airplane' />
              </Col>
              <Col xl='1' lg='1'></Col>
              <Col xl='8' lg='8' md='12' sm='12'>
                <Form 
                  heading={title}
                  body={document.description}
                  formboxes={formboxes}
                  disabled={true}
                  handleSubmit={ () => {} }
                />
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

Document.propTypes = {
  fetcher: PropTypes.instanceOf(Fetcher).isRequired,
  sendMessage: PropTypes.func.isRequired
}

export default Document
