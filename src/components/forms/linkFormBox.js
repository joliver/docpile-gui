import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './../../css/forms/form.css'

class LinkFormBox extends Component {
  constructor(props) {
    super(props)
    // this.state = { value: '' }
    this.handleChange = this.handleChange.bind(this)
  }
  
  handleChange (event) {
    // this.setState({ value: event.target.value })
    this.props.onChange({ label: this.props.label, value: event.target.value })
  }
  
  render () {
    const { className, editing, value } = this.props
    let linkBox = ''
    if (editing || !value || value.length === 0) {
      const disabled = value ? value.length === 0 : false
      linkBox = <textarea {...this.props} className={`input textarea ${className}`} disabled={disabled} onChange={this.handleChange} />
    } else {
      linkBox = <LinkBox {...this.props} className={`input textarea ${className}`} links={value} />
    }
    return linkBox
  }
}

// lists a collection of linked items
const LinkBox = (props) => {
  const links = props.links.map((link, i) => {
    let comma = i === props.links.length - 1 ? '' : ', '
    return (
      <span key={i}><Link className="link" to={`${props.path}/${link}`}>{link}</Link>{comma}</span>
    )
  })
  return (
    <div {...props} >
      {links}
    </div>
  )
}

LinkFormBox.propTypes = {
  editing: PropTypes.bool, // isRequired
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  // value must be an array
  path: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default LinkFormBox