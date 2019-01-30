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

  componentDidMount() {
    // set initial values in state
    this.props.formboxes.forEach(formbox => {
      let { label, value } = formbox
      if (!value) { value = null }
      this.handleChange({ label, value })
    })
  }

  // handles continuously updating the entered data
  handleChange = formData => {
    const { values } = this.state
    values[formData.label] = formData.value
    this.setState({ submitted: false, values })
  }

  // sends values to the parent handleSubmit function
  async handleSubmit () {
    console.log('handleSubmit inside the form', this.state.values)
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
          tags={formbox.tags}
          key={i} 
          onChange={this.handleChange}
        />
      )
    })
    return (
      <div className='form'>
        <Row>
          <Col lg='12' md='12' sm='12' xs='12'>
            <div className='heading'>{this.props.heading}</div>
            <div className='body'>{this.props.body}</div>
            <div className='formboxes'>
              {formboxes}
            </div>
            {!this.props.disabled && 
              <Button cssLabel='submit' label={this.props.submitLabel || 'Submit'} onClick={this.handleSubmit.bind(this)} />
            }
            {this.props.cancelable &&
              <Button cssLabel='cancel' label='Cancel' onClick={this.props.onCancel} />
            }
          </Col>
        </Row>
      </div>
    )
  }
}

export default Form