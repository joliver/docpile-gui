import React from 'react'
import { Link } from 'react-router-dom'
import logo from './../../assets/icons/paper-plane.png'
import './../../css/navigation/logo.css'

const Logo = () => (
  <div className='logo'>
    <Link to='/'><img src={logo} className='logo-image' alt='Docpile logo' /></Link>
    <Link className='logo-title' to='/'>Docpile</Link>
  </div>
)

export default Logo