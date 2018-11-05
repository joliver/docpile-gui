import React from 'react'
import { Link } from 'react-router-dom'
import './../../css/atoms/button.css'

const Button = (props) => {
  let cssClass = props.cssLabel ? `button ${props.cssLabel}`: 'button'
  const imgClass = props.label ? 'button-image-left' : 'button-image'
  const labelClass = props.src ? 'button-label button-label-img' : 'button-label'
  let img = props.src ? <img className={imgClass} src={props.src} alt={props.alt} /> : ''
  if (props.onClick) {
    return (
      <div className={cssClass} onClick={props.onClick}>
        {img}
        <div className={labelClass} content={props.label}>{props.label}</div>
      </div>
    )
  } else {
    return (
      <div className={cssClass}>
        <Link className='button-link' to={props.link ? props.link : '#'}>
          {img}
          <div className={labelClass} content={props.label}>{props.label}</div>
        </Link>
      </div>
    )
  }
}

export default Button