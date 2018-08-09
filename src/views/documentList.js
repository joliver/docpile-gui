import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Fetcher from './../tools/fetcher'
import moment from 'moment'
import { Row, Col } from 'reactstrap'
import './../css/views/view.css'

class DocumentList extends Component {
  state = {
    documents: null,
    loading: false,
    dateFmt: ''
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
    const { documents, loading, dateFmt } = this.state
    const loaded = documents ? true : false
    const docs = loaded ? this.state.documents.map((doc, i) => JSON.stringify(doc)) : ''
    return (
      <div className='view'>
        {loading &&
          <p className='preview-text'>Loading... please wait.</p>
        }
        {loaded &&
          <div className='documents'>
            <h4 className='title'>Documents</h4>
            <Row>
              <Col xl='1' lg='1'></Col>
              <Col xl='8' lg='8' md='12' sm='12'>
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

DocumentList.propTypes = {
  fetcher: PropTypes.instanceOf(Fetcher).isRequired,
  sendMessage: PropTypes.func.isRequired
}

export default DocumentList
