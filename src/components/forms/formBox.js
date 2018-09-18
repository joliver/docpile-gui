import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LinkFormBox from './linkFormBox'
import './../../css/forms/form.css'

class FormBox extends Component {  
  handleChange = (event) => {
    // this.setState({ value: event.target.value })
    this.props.onChange({ label: this.props.label, value: event.target.value })
  }
  
  render () {
    let cssClass = this.props.className ? ` ${this.props.className}` : ''
    let cssLabel = `input ${this.props.type}${cssClass}`
    let inputBox = ''
    if (this.props.type === 'linkbox') {
      inputBox = <LinkFormBox {...this.props} />
    }
    else if (this.props.type === 'textarea') {
      inputBox = <textarea {...this.props} className={cssLabel} onChange={this.handleChange} />
    } else {
      inputBox = <input {...this.props} className={cssLabel} onChange={this.handleChange} />
    }
    
    return (
      <div className='form-box' onSubmit={this.handleSubmit}>
        <div className='label'>{this.props.label}</div>
        {inputBox}
      </div>
    )
  }
}

FormBox.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  // value
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default FormBox