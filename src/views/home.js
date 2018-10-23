import React from 'react'
import Button from './../components/atoms/button'
import FormBox from './../components/forms/formBox'
import plane from './../assets/icons/flying-plane-lg.png'
import './../css/views/view.css'

const Home = () => (
  <div id='home' className='view'>
    <img className='highlight-img' src={plane} alt='paper airplane' />
    <h4 className='welcome'>Welcome to Docpile.</h4>
    <FormBox type='text' placeholder='Type anything about a document here.' />
    <Button cssLabel='submit' label='Search' onClick={() => {}} />
    <div className='clear'></div>
  </div>
)

export default Home