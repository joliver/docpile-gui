import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import DatePicker from 'react-datepicker'
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

  getTagName = id => (
    this.state.tags && this.state.tags.filter(tag => (tag.tag_id === id))[0] ?
      this.state.tags.filter(tag => (tag.tag_id === id))[0].tag_name
    : ''
  )

  // generates formbox styling with a label for an input element
  inForm = (label, children) => (
    <div className='formbox'>
      <div className='label'>{label}</div>
      {children}
    </div>
  )

  // generates a collection of linked tag elements
  tagBox = ids => (
    ids ? ids.map((tagId, i) => (
      <span className='tagbox-tag' key={i}><Link to={`../tags/${tagId}`}>{this.getTagName(tagId)}</Link></span>
    )) : ''
  )
  
  render () {
    const { document, tags, loading } = this.state
    return (
      <div className='table-view'>
        {loading &&
          <Loader /> 
        }
        {!loading && document && tags &&
          <div>
            <h4 className='header'>View Document</h4>
            <div className='description'>Here is what we know about this document.</div>
            <Row>
              <Col xl='2' lg='2' md='12' sm='12'>
                <img className='option-img' src={flying} alt='flying paper airplane' />
              </Col>
              <Col xl='1' lg='1'></Col>
              <Col xl='8' lg='8' md='12' sm='12'>
                <div className='form'>
                  {this.inForm('document number',
                    <input
                      className='input'
                      value={document.document_id}
                      placeholder='no document number given'
                      disabled
                    />
                  )}
                  {this.inForm('description',
                    <input
                      className='input'
                      value={document.description}
                      placeholder='no description given'
                      disabled
                    />
                  )}
                  {this.inForm('starts at page',
                    <input
                      className='input'
                      value={document.asset_offset}
                      placeholder='no page number given'
                      disabled
                    />
                  )}
                  {this.inForm('date uploaded',
                    <DatePicker
                      className='input'
                      selected={moment(document.timestamp)}
                      placeholderText='no published date given'
                      disabled
                    />
                  )}
                  {this.inForm('date published',
                    <DatePicker
                      className='input'
                      selected={moment(document.published)}
                      placeholderText='no published date given'
                      disabled
                    />
                  )}
                  {this.inForm('start date',
                    <DatePicker
                      className='input'
                      selected={moment(document.period_min)}
                      placeholderText='no start date date given'
                      disabled
                    />
                  )}
                  {this.inForm('end date',
                    <DatePicker
                      className='input'
                      selected={moment(document.period_max)}
                      placeholderText='no end date date given'
                      disabled
                    />
                  )}
                  {this.inForm('tags', this.tagBox(document.tags))}
                </div>
                <Button className='inline' label='View connected file.' src={success} link={`/files/${document.asset_id}`} />
                <div className='clear'></div>
              </Col>
            </Row>
          </div>
        }
        {!loading && (!document || !tags) &&
          <p className='preview-text'>This document could not be displayed.</p>
        }
      </div>
    )
  }
}

export default withRouter(Document)
