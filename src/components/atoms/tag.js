import React from 'react'
import { Link } from 'react-router-dom'
import './../../css/atoms/tag.css'

// only used by TagAdder

const Tag = (props) => {
  let css = props.cssLabel ? `tag ${props.cssLabel}` : 'tag'

  // specifically mark aliases
  css = props.alias ? `${css} tag-alias` : css
  let label = props.alias ? `${props.label} (alias)` : props.label
  label = props.link ? <Link className='tag-link' to={props.link}>{label}</Link> : label

  // props.bolded only exists on tag search results, which have a click-to-add onClick rather than a link
  if (props.bolded && props.bolded.length > 0) {
    label = props.label.map((character, i) => (
      props.bolded.indexOf(i) > -1 ? <span className='bold'>{character}</span> : character
    ))
  }

  if (props.onClick) {
    return (
      <div className={css} onClick={props.onClick}>
        <div className='tag-label' content={props.label}>{label}</div>
      </div>
    )
  } else {
    return (
      <div className={css}>
        <div className='tag-label' content={props.label}>{label}</div>
      </div>
    )
  }
}

export default Tag