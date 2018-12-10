import React, { Component } from 'react'
import config from '../tools/config'
import { Row, Col } from 'reactstrap'
import Form from './../components/forms/form'
import Loader from '../components/atoms/loader'
import Button from '../components/atoms/button'
import Documents from './documents'
import moment from 'moment'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/views/view.css'

class Tag extends Component {
  state = {
    tag: null,
    editing: false,
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
      this.setState({ loading: false })
    }
    else { 
      this.setState({ tag: data.data, loading: false })
    }
  }

  async updateTag () {
    const { id } = this.props.match.params
    this.setState({ loading: true })
    // check if updating name or adding/removing aliases

    // const data = await this.props.fetcher.renameTag(name)
    this.setState({ loading: false })
  }

  handleSubmit () { // fix
    this.updateTag()
  }

  toggleEdit () {
    this.setState({ editing: !this.state.editing })
  }
  
  render () {
    const { tag, editing, loading } = this.state
    const title = tag ? `Tag: ${tag.tag_name}` : ''
    const loaded = tag ? true : false

    const formboxes = tag ? [
      { label: 'tag number', type: 'number', value: tag.tag_id, disabled: true, placeholder: `the tag's unique number` },
      { label: 'tag name', type: 'text', value: tag.tag_name, placeholder: `the tag's name` },      
      { label: 'created', type: 'datetime-local', disabled: true, value: moment(tag.timestamp).format(config.dateFormat), placeholder: 'no date given' },
      { label: 'aliases', type: 'tagbox', value: tag.synonyms, placeholder: 'no aliases added', path: '../tags', tags: [] }, 
    ] : []
  
    return (
      <div className='table-view'>
        {loading &&
          <Loader /> 
        }
        {loaded &&
          <div>
            <div className='table-view'>
              <h4 className='header'>{title}</h4>
              <p className='description'>View some information about a tag and its documents.</p>
            </div>
            <Row>
              <Col xl='1' lg='1'></Col>
              <Col xl='2' lg='2' md='12' sm='12'>
                <img className='option-img' src={plane} alt='paper airplane' />
              </Col>
              <Col xl='1' lg='1'></Col>
              <Col xl='7' lg='7' md='12' sm='12'>
                <Form 
                  formboxes={formboxes}
                  disabled={editing}
                  handleSubmit={ () => {} }
                />
                <Button cssLabel='reverse view-button' label='Rename Tag' />
                <Button cssLabel='reverse view-button' label='Delete Tag' />
                <Button cssLabel='reverse view-button' label='Remove Selected Aliases' />
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
