import React from 'react'
import { Link } from 'react-router-dom'
import plane from './../../assets/icons/plane.svg'
import './../../css/navigation/logo.css'

const Logo = () => (
  <div className='logo'>
    <Link to='/'><img src={plane} className='logo-image' alt='Docpile logo' /></Link>
    <Link className='logo-title' to='/'>Docpile</Link>
  </div>
)

export default Logo