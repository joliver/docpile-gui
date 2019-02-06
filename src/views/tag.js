import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import DatePicker from 'react-datepicker'
import Loader from '../components/atoms/loader'
import Button from '../components/atoms/button'
import Documents from './documents'
import flying from './../assets/icons/flying.svg'
import './../css/views/view.css'

class Tag extends Component {
  state = {
    tag: null,
    editing: false,
    loading: false
  }
  
  componentDidMount () {
    this.fetchTag()
  }
  
  async fetchTag () {
    const { id } = this.props.match.params
    this.setState({ loading: true })
    const data = await this.props.fetcher.getTag(id)
    if (!data.success) { 
      this.props.sendMessage(data.messages[0], !data.success) 
      this.setState({ loading: false })
    }
    else { 
      this.setState({ tag: data.data, loading: false })
    }
  }

  async updateTag () {
    // const { id } = this.props.match.params
    this.setState({ loading: true })
    // check if updating name or adding/removing aliases

    // const data = await this.props.fetcher.renameTag(name)
    this.setState({ loading: false })
  }

  handleSubmit () { // fix
    this.updateTag()
  }

  toggleEdit () {
    this.setState({ editing: !this.state.editing })
  }

  // generates formbox styling with a label for an input element
  inForm = (label, children) => (
    <div className='formbox'>
      <div className='label'>{label}</div>
      {children}
    </div>
  )
  
  render () {
    const { tag, loading } = this.state
    return (
      <div className='table-view'>
        {loading &&
          <Loader /> 
        }
        {!loading && tag &&
          <div>
            <div className='table-view'>
              <h4 className='header'>Tag: {tag.tag_name}</h4>
              <p className='description'>View some this.inFormation about a tag and its documents.</p>
            </div>
            <Row>
              <Col xl='1' lg='1'></Col>
              <Col xl='2' lg='2' md='12' sm='12'>
                <img className='option-img' src={flying} alt='flying paper airplane' />
              </Col>
              <Col xl='1' lg='1'></Col>
              <Col xl='7' lg='7' md='12' sm='12'>
                <div className='form'>
                  {this.inForm('tag number',
                    <input
                      className='input'
                      value={tag.tag_id}
                      disabled
                    />
                  )}
                  {this.inForm('description',
                    <div
                      className='input'
                      value={tag.tag_name}
                      placeholder={`the tag's name`}
                      disabled
                    />
                  )}
                  {this.inForm('date created',
                    <DatePicker
                      className='input'
                      selected={tag.timestamp}
                      disabled
                    />
                  )}
                  {this.inForm('aliases', 'test aliases')}
                </div>
                <Button className='reverse view-button' label='Rename Tag' />
                <Button className='reverse view-button' label='Delete Tag' />
                <Button className='reverse view-button' label='Remove Selected Aliases' />
              </Col>
            </Row>
            <Documents {...this.props} tagId={tag.tag_id} />
          </div>
        }
        {!loading && !tag &&
          <p className='preview-text'>This tag could not be displayed.</p>
        }
      </div>
    )
  }
}

export default withRouter(Tag)
