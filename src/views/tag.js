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
      { label: 'ID', type: 'number', value: tag.tag_id, placeholder: 'tag ID' },
      { label: 'created', type: 'datetime-local', value: moment(tag.timestamp).format(config.dateFormat), placeholder: 'no date given' },
      { label: 'also known as', type: 'linkbox', value: document.synonyms, placeholder: 'no synonyms added', path: '../tags' }, 
    ] : []
  
    return (
      <div className='view'>
        {loading &&
          <Loader /> 
        }
        {loaded &&
          <div className='tag'>
            <Row>
              <Col xl='3' lg='3' md='12' sm='12'>
                <img className='option-img' src={plane} alt='paper airplane' />
              </Col>
              <Col xl='1' lg='1'></Col>
              <Col xl='8' lg='8' md='12' sm='12'>
                <Form 
                  heading={title}
                  body={'Here\'s a little more information about this tag.'}
                  formboxes={formboxes}
                  disabled={true}
                  handleSubmit={ () => {} }
                />
              </Col>
            </Row>
          </div>
        }
        {!loading && !loaded &&
          <p className='preview-text'>This tag could not be displayed.</p>
        }
      </div>
    )
  }
}

Tag.propTypes = {
  fetcher: PropTypes.instanceOf(Fetcher).isRequired,
  sendMessage: PropTypes.func.isRequired
}

export default Tag
