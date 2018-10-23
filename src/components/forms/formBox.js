import React, { Component } from 'react'
import moment from 'moment'
import config from './../../tools/config'
import Button from './../atoms/button'
import TagBox from './tagBox'
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
    let { className, type, label } = this.props
    label = label ? <div className='label'>{label}</div> : ''
    let cssClass = className ? ` ${className}` : ''
    let cssLabel = `input ${type}${cssClass}`
    let inputBox = ''
    if (type === 'tagbox') {
      inputBox = <TagBox {...this.props} />
    }
    else if (type === 'textarea') {
      inputBox = <textarea {...this.props} className={cssLabel} onChange={this.handleChange} />
    } else if (type === 'image-button') {
      inputBox = <span><Button label={label} src={this.props.src} link={this.props.path} cssLabel={`formbox-button ${className}`} /><div className='clear'></div></span>
      label = ''
    } else {
      inputBox = <input {...this.props} className={cssLabel} onChange={this.handleChange} />
    }
    
    return (
      <div className='form-box'>
        {label}
        {inputBox}
      </div>
    )
  }
}

export default FormBox