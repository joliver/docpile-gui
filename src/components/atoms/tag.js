import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
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

Tag.propTypes = {
  cssLabel: PropTypes.string, // to set styling
  boldedIndex: PropTypes.arrayOf(PropTypes.number), // for bolded letters
  label: PropTypes.string, // for text
  link: PropTypes.string, // for a link instead of an action
  onClick: PropTypes.func // for an action instead of a link
}

export default Tag