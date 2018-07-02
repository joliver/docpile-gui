import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './../../css/atoms/button.css'

const Button = (props) => {
  let cssLabel = props.cssLabel ? 'button ' + props.cssLabel : 'button'
  let img = props.src ? <img src={props.src} alt={props.alt} width="18" height="18" /> : ""
  let label = props.link ? <Link className='button-link' to={props.link}>{props.label}</Link> : props.label
  if (props.onClick) {
    return (
      <div className={cssLabel} onClick={props.onClick}>
        <div className='button-image'>{img}</div>
        <div className='button-label' content={props.label}>{label}</div>
      </div>
    )
  } else {
    return (
      <div className={cssLabel}>
        <div className='button-image'>{img}</div>
        <div className='button-label' content={props.label}>{label}</div>
      </div>
    )
  }
}

Button.propTypes = {
  cssLabel: PropTypes.string, // to set styling
  src: PropTypes.string, // for image
  alt: PropTypes.string, // for image
  label: PropTypes.string, // for text
  link: PropTypes.string, // for a link instead of an action
  onClick: PropTypes.func // for an action instead of a link
}

export default Button