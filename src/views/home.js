import React from 'react'
import Form from './../components/forms/form'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/views/view.css'

const Home = () => (
  <div id='home' className='view'>
    <img className='highlight-img' src={plane} alt='paper airplane' />
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
  </div>
)

export default Home