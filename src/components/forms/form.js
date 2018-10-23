import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import FormBox from './formBox'
import Button from './../atoms/button'
import './../../css/forms/form.css'

class Form extends Component {
  state = {
    submitted: false,
    values: {}
  }

  // handles continuously updating the entered data
  handleChange = (eventObj) => {
    const { values } = this.state
    values[eventObj.label] = eventObj.value
    this.setState({ submitted: false, values })
  }

  // sends values to the parent handleSubmit function
  async handleSubmit () {
    this.setState({ submitted: true })
    await this.props.handleSubmit(this.state.values)
  }

  render () {
    const disabled = this.props.disabled && this.props.type !== 'image-button' ? 'disabled' : ''
    const formboxes = this.props.formboxes.map((formbox, i) => {
      let cssLabel = formbox.className ? `${disabled} ${formbox.className}`: disabled
      return (
        <FormBox 
          label={formbox.label}
          type={formbox.type}
          value={formbox.value}
          className={cssLabel}
          placeholder={formbox.placeholder} 
          path={formbox.path}
          src={formbox.src}
          tags={formbox.tags}
          key={i} 
          onChange={this.handleChange}
        />
      )
    })
    
    // displays the submitted data (for development error checking)
    let returnFormHeader = this.state.submitted ? <div className='return-form-header'></div> : ''
    let returnFormData = []
    for (let key in this.state.values) {
      returnFormData.push(<div className='return-form-item' key={key}>{key}: {this.state.values[key]}</div>)
    }
    let returnForm = this.state.submitted ? returnFormData : ''

    return (
      <div className='form'>
        <Row>
          <Col lg='12' md='12' sm='12' xs='12'>
            <div className='heading'>{this.props.heading}</div>
            <div className='body'>{this.props.body}</div>
            <div className='formboxes'>
              {formboxes}
            </div>
            { !this.props.disabled && 
              <Button cssLabel='submit' label='Submit' onClick={this.handleSubmit.bind(this)} />
            }
            <div className='return-form'>
              {returnFormHeader}
              {returnForm}
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Form