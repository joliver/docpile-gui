import React from 'react'
import { NavLink } from 'react-router-dom'
// import { NavLink } from 'reactstrap';
import './../../css/navigation/navlink.css'

const Navlink = (props) => (
  <NavLink {...props} exact className='navlink'>
    {props.label}
  </NavLink>
)

export default Navlink

// activeClassName doesn't work currently