import React from 'react'
import { Link } from 'react-router-dom'
import './../../css/atoms/tag.css'

const Tag = (props) => {
  let cssLabel = props.cssLabel ? 'tag ' + props.cssLabel : 'tag'
  let label = props.link ? <Link className='tag-link' to={props.link}>{props.label}</Link> : props.label
  if (props.onClick) {
    return (
      <div className={cssLabel} onClick={props.onClick}>
        <div className='tag-label' content={props.label}>{label}</div>
      </div>
    )
  } else {
    return (
      <div className={cssLabel}>
        <div className='tag-label' content={props.label}>{label}</div>
      </div>
    )
  }
}

export default Tag