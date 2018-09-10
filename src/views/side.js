import React from 'react'
import { Row, Col } from 'reactstrap'
import Form from './../components/forms/form'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/views/view.css'

const Side = () => (
  <div id='side' className='view'>
    <Row>
      <Col xl='3' lg='3' md='12' sm='12'>
        <img className='option-img' src={plane} alt='paper airplane' />
      </Col>
      <Col xl='1' lg='1'></Col>
      <Col xl='8' lg='8' md='12' sm='12'>
        <Form 
          heading='Welcome to Docpile.' 
          body='Have a document to upload? Tell us a little about it.'
          formboxes={[
            { label: 'name', type: 'text', placeholder: 'Type a name here.' },
            { label: 'tags', type: 'text', placeholder: 'List all the tags here.' },
            { label: 'description', type: 'textarea', placeholder: 'Talk about it here.' }, 
          ]}
          handleSubmit={ () => {} }
        />
      </Col>
    </Row>
  </div>
)

export default Side