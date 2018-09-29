import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
  onChange = (eventObj) => {
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
    // displays the inputs for entering data
    const disabled = this.props.disabled ? 'disabled' : ''
    const formboxes = this.props.formboxes.map((formbox, i) => {
      const cssLabel = this.props.className ? `${disabled} ${formbox.className}`: disabled
      return (
        <FormBox 
          label={formbox.label}
          type={formbox.type}
          value={formbox.value}
          className={cssLabel}
          placeholder={formbox.placeholder} 
          editing={formbox.editing ? formbox.editing : false}
          path={formbox.path}
          key={i} 
          onChange={this.onChange} 
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


Form.propTypes = {
  heading: PropTypes.string.isRequired,
  body: PropTypes.string,
  formboxes: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired
}

export default Form