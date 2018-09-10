import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'reactstrap'
import FormBox from './formBox'
import Button from './../atoms/button'
import './../../css/forms/form.css'

class Form extends Component {
  constructor (props) {
    super(props)
    this.state = { values: [] }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  
  // handles continuously updating the entered data
  handleInputChange (eventObj) {
    let valuesArray = this.state.values.filter((value) => value.label !== eventObj.label )
    valuesArray.push({ label: eventObj.label, value: eventObj.value })
    this.setState({ submitted: false, values: valuesArray })
  }
  
  // sends a labels array and a values array up the parent handleSubmit function
  async handleSubmit () {
    this.setState({ submitted: true })
    let labelsArray = this.state.values.map((valueObj) => valueObj.label)
    let valuesArray = this.state.values.map((valueObj) => valueObj.value)
    await this.props.handleSubmit(labelsArray, valuesArray)
  }

  render (props) {
    // displays the inputs for entering data
    const disabled = this.props.disabled ? 'disabled' : ''
    let formboxes = this.props.formboxes.map((formbox, i) => {
      let cssLabel = this.props.className ? `${disabled} ${formbox.className}`: disabled
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
          onChange={this.handleInputChange} 
        />
      )
    })
    
    // displays the submitted data (for development error checking)
    let returnFormHeader = this.state.submitted ? <div className='return-form-header'></div> : ''
    let returnFormData = this.state.values.map((obj, i) => (
      <div className='return-form-item' key={i}>{obj.label}: {obj.value}</div>
    ))
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
            {!this.props.disabled && <Button cssLabel='submit' label='Submit' onClick={this.handleSubmit} />}
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