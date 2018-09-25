import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import config from './../../tools/config'
import LinkFormBox from './linkFormBox'
import './../../css/forms/form.css'

class FormBox extends Component {  
  handleChange = (event) => {
    let { value } = event.target
    if (this.props.type === 'datetime-local') {
      value = moment(value).format(config.dateFormt)
    }
    this.props.onChange({ label: this.props.label, value })
  }
  
  render () {
    const { className, type, label } = this.props
    let cssClass = className ? ` ${className}` : ''
    let cssLabel = `input ${type}${cssClass}`
    let inputBox = ''
    if (type === 'linkbox') {
      inputBox = <LinkFormBox {...this.props} />
    }
    else if (type === 'textarea') {
      inputBox = <textarea {...this.props} className={cssLabel} onChange={this.handleChange} />
    } else {
      inputBox = <input {...this.props} className={cssLabel} onChange={this.handleChange} />
    }
    
    return (
      <div className='form-box' onSubmit={this.handleSubmit}>
        <div className='label'>{label}</div>
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