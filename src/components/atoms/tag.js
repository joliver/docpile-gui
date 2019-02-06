import React from 'react'
import './../../css/atoms/tag.css'

// Tag is an atomic element used only by TagAdder.

const Tag = props => {
  let label = props.alias ? `${props.label} (alias)` : props.label
  // props.bolded only exists on suggested tags
  if (props.bolded && props.bolded.length > 0) {
    label = props.label.map((character, i) => (
      props.bolded.indexOf(i) > -1 ? <span className='bold'>{character}</span> : character
    ))
  }
  return (
    <div 
      className={props.alias ? `tag tag-alias ${props.className}` : `tag ${props.className}`} 
      onClick={props.onClick}
    >
      <div className='tag-label'>{label}</div>
    </div>
  )
}

export default Tag