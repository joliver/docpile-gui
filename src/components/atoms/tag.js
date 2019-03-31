import React from 'react'
import './../../css/atoms/tag.css'

// Tag is an atomic element used only by TagAdder.

const Tag = props => {
  let css = props.alias ? 'table-tag tag-alias' : 'table-tag'
  let added = props.added ? 'tag-added' : ''

  // props.bolded only exists on suggested tags
  let label = props.alias ? `${props.label} (alias)` : props.label
  if (props.bolded && props.bolded.length > 0) {
    label = label.split('').map((character, i) => (
      props.bolded.indexOf(i) > -1 ? <span className='bold' key={i}>{character}</span> : character
    ))
  }

  return (
    <div 
      className={`${css} ${added} ${props.className ? props.className: ""}`} 
      onClick={props.onClick}
      key={label}
    >
      <div className='tag-label'>{label}</div>
    </div>
  )
}

export default Tag