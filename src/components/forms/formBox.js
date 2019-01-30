import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import config from './../../tools/config'
import TagBox from './tagBox'
import './../../css/forms/form.css'

class FormBox extends Component {
  state = {
    value: null
  }

  handleChange = event => {
    let value = ''
    if (this.props.type === 'date') {
      // DatePicker events are the raw value already
      value = event
    } else {
      value = event.target.value
    }
    this.setState({ value })
    if (this.props.type === 'date') {
      // send dates to the parent onChange function as formatted date strings
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
      inputBox = <TagBox {...this.props} onChange={this.handleChange} />
    } else if (type === 'date') {
      inputBox = <DatePicker
        className='input'
        onChange={this.handleChange}
        selected={this.state.value}
        todayButton='Today'
        maxDate={moment()}
        placeholderText={this.props.placeholder}
      />
    } else if (type === 'date-range') {
      inputBox = <DatePicker
        className='input'
        onChange={this.handleChange}
        selected={this.state.value}
        todayButton='Today'
        maxDate={moment()}
        placeholderText={this.props.placeholder}
      />
    } else if (type === 'textarea') {
      inputBox = <textarea {...this.props} className={cssLabel} onChange={this.handleChange} />
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