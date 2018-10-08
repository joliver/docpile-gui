import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import Loader from '../components/atoms/loader'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/views/view.css'

class Tags extends Component {
  state = {
    tags: null,
    loading: false
  }
  
  componentDidMount () {
    this.fetchTags()
  }
  
  async fetchTags () {
    this.setState({ loading: true })
    const data = await this.props.fetcher.getTags()
    if (!data.success) { 
      this.props.sendMessage(data.messages[0], !data.success) 
    }
    else { 
      this.setState({ tags: data.data, loading: false })
    }
  }
  
  render () {
    let { tags, loading } = this.state
    const loaded = tags ? true : false
    tags = loaded ? this.state.tags.map((tag, i) => JSON.stringify(tag)) : ''
    return (
      <div className='view'>
        {loading &&
          <Loader />
        }
        {loaded &&
          <div className='documents'>
            <Row>
            <Col xl='3' lg='3' md='12' sm='12'>
              <img className='option-img' src={plane} alt='paper airplane' />
            </Col>
            <Col xl='1' lg='1'></Col>
            <Col xl='8' lg='8' md='12' sm='12'>
              <h4 className='title'>Tags</h4>
              {tags}
            </Col>
          </Row>
          </div>
        }
        {!loading && !loaded &&
          <p className='preview-text'>The tag list could not be displayed.</p>
        }
      </div>
    )
  }
}

export default Tags
