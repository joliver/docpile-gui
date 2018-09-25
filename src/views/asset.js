import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Fetcher from './../tools/fetcher'
import { Row, Col } from 'reactstrap'
import Form from './../components/forms/form'
import Loader from '../components/atoms/loader'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/views/view.css'

class Asset extends Component {
  state = {
    file: 'test-file', // test
    documents: [ 1, 2, 3, 4 ], // test
    loading: false,
  }

  componentDidMount() {
    // pull file data and linked documents here
  }
    
  render () {
    const { id } = this.props.match.params
    const { file, documents, loading } = this.state
    const title = file ? `File #${id}` : ''
    const body = 'Preview this file or view connected documents.'
    const loaded = file ? true : false
    const formboxes = [
      { label: 'placeholder for preview file', type: 'text', value: file, placeholder: 'file' },
      { label: 'placeholder for link documents', type: 'linkbox', value: documents, placeholder: 'linked documents', path: '../documents' }, 
    ]  
    return (
      <div className='view'>
        {loading &&
          <Loader /> 
        }
        {loaded &&
          <div className='asset'>
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
                  disabled={true}
                  handleSubmit={ () => {} }
                />
              </Col>
            </Row>
          </div>
        }
        {!loading && !loaded &&
          <p className='preview-text'>Data about this file could not be displayed.</p>
        }
      </div>
    )
  }
}

Asset.propTypes = {
  fetcher: PropTypes.instanceOf(Fetcher).isRequired,
  sendMessage: PropTypes.func.isRequired
}

export default Asset
