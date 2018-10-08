import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import Loader from '../components/atoms/loader'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/views/view.css'

class Documents extends Component {
  state = {
    documents: null,
    loading: false
  }
  
  componentDidMount () {
    this.fetchDocuments()
  }
  
  async fetchDocuments () {
    this.setState({ loading: true })
    const data = await this.props.fetcher.getDocuments()
    if (!data.success) { 
      this.props.sendMessage(data.messages[0], !data.success) 
    }
    else { 
      this.setState({ documents: data.data, loading: false })
    }
  }
  
  render () {
    const { documents, loading } = this.state
    const loaded = documents ? true : false
    const docs = loaded ? this.state.documents.map((doc) => JSON.stringify(doc)) : ''
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
              <h4 className='title'>Documents</h4>
              {docs}
            </Col>
          </Row>
          </div>
        }
        {!loading && !loaded &&
          <p className='preview-text'>The document list could not be displayed.</p>
        }
      </div>
    )
  }
}

export default Documents
