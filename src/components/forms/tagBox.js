import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './../../css/forms/form.css'

class TagBox extends Component {
  handleChange = (event) => {
    this.props.onChange({ label: this.props.label, value: event.target.value })
  }

  getTagObject = id => (
    this.props.tags ? this.props.tags.filter(tag => (
      tag.tag_id === id
    ))[0] : {}
  )

  getTagName = id => (
    this.props.tags ? this.getTagObject(id).tag_name : ''
  )
  
  render () {
    const { className, editing, value } = this.props
    let box = ''
    if (editing || !value || value.length === 0) {
      const disabled = value ? value.length === 0 : false
      box = <textarea {...this.props} className={`input textarea ${className}`} disabled={disabled} onChange={this.handleChange} />
    } else {
      box = <Box {...this.props} className={`input textarea ${className}`} tagItems={value} getTagName={this.getTagName} />
    }
    return box
  }
}

// holds a collection of linked tags
const Box = (props) => {
  const aliases = props.tags.length === 0 // if there are no tags in props, these are aliases
  const tags = props.tagItems.map((tagItem, i) => {
    let tagName = aliases ? tagItem.name : props.getTagName(tagItem) // tagItem is either an alias object or a tag id
    let link = aliases ? '#' : `${props.path}/${tagItem}` // if a tag, link; if an alias, don't link
    return (
      <span className="formbox-link" key={i}><Link to={link}>{tagName}</Link></span>
    )
  })
  return (
    <div {...props}>
      {tags}
    </div>
  )
}

export default TagBox