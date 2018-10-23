import React from 'react'
import { Link } from 'react-router-dom'
import './../../css/atoms/button.css'

const Button = (props) => {
  const cssLabel = props.cssLabel ? 'button ' + props.cssLabel : 'button'
  const imgClass = props.label ? 'button-image-left' : 'button-image'
  let img = props.src ? <img className={imgClass} src={props.src} alt={props.alt} /> : ''
  if (props.onClick) {
    return (
      <div className={cssLabel} onClick={props.onClick}>
        {img}
        <div className='button-label' content={props.label}>{props.label}</div>
      </div>
    )
  } else {
    return (
      <div className={cssLabel}>
        <Link className='button-link' to={props.link ? props.link : '#'}>
          {img}
          <div className='button-label' content={props.label}>{props.label}</div>
        </Link>
      </div>
    )
  }
}

export default Button