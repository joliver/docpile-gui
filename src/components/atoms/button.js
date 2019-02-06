import React from 'react'
import { Link } from 'react-router-dom'
import './../../css/atoms/button.css'

const Button = props => (props.onClick ?
  <div className={`button ${props.className}`} onClick={props.onClick}>
    {props.src ? 
      <img 
        className={props.label ? 'button-image-left' : 'button-image'}
        src={props.src}
        alt={props.alt} 
      /> 
      : ''
    }
    <div 
      className={props.src ? 'button-label button-label-img' : 'button-label'} 
      content={props.label}
    >
      {props.label}
    </div>
  </div>
  :
  <div className={`button ${props.className}`}>
    <Link className='button-link' to={props.link ? props.link : '#'}>
      {props.src ? 
        <img 
          className={props.label ? 'button-image-left' : 'button-image'}
          src={props.src}
          alt={props.alt} 
        /> 
        : ''
      }
      <div
        className={props.src ? 'button-label button-label-img' : 'button-label'}
        content={props.label}
      >
        {props.label}
      </div>
    </Link>
  </div>
)

export default Button