import React, { Component } from 'react'
import config from '../tools/config'
import { Row, Col } from 'reactstrap'
import Form from './../components/forms/form'
import Loader from '../components/atoms/loader'
import Documents from './documents'
import moment from 'moment'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/views/view.css'

class Tag extends Component {
  state = {
    tag: null,
    loading: false
  }
  
  componentDidMount () {
    this.fetchTag()
  }
  
  async fetchTag () {
    const { id } = this.props.match.params
    this.setState({ loading: true })
    const data = await this.props.fetcher.getTag(id)
    if (!data.success) { 
      this.props.sendMessage(data.messages[0], !data.success) 
    }
    else { 
      this.setState({ tag: data.data, loading: false })
    }
  }
  
  render () {
    const { tag, loading } = this.state
    const title = tag ? tag.tag_name : ''
    const loaded = tag ? true : false

    const formboxes = tag ? [
      { label: 'tag number', type: 'number', value: tag.tag_id, placeholder: `the tag's unique number` },
      { label: 'created', type: 'datetime-local', value: moment(tag.timestamp).format(config.dateFormat), placeholder: 'no date given' },
      { label: 'aliases', type: 'tagbox', value: tag.synonyms, placeholder: 'no aliases added', path: '../tags', tags: [] }, 
    ] : []
  
    return (
      <div className='table-view'>
        {loading &&
          <Loader /> 
        }
        {loaded &&
          <div className='tag'>
            <Row>
              <Col xl='1' lg='1'></Col>
              <Col xl='2' lg='2' md='12' sm='12'>
                <img className='option-img' src={plane} alt='paper airplane' />
              </Col>
              <Col xl='1' lg='1'></Col>
              <Col xl='7' lg='7' md='12' sm='12'>
                <Form 
                  heading={title}
                  body={'Here\'s a little more information about this tag.'}
                  formboxes={formboxes}
                  disabled={true}
                  handleSubmit={ () => {} }
                />
              </Col>
            </Row>
            <Documents {...this.props} tagId={tag.tag_id} />
          </div>
}
        {!loading && !loaded &&
          <p className='preview-text'>This tag could not be displayed.</p>
        }
      </div>
    )
  }
}

export default Tag
