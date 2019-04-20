import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import DatePicker from 'react-datepicker'
import Loader from '../components/atoms/loader'
import Button from '../components/atoms/button'
import TagAdder from '../components/atoms/tagAdder'
import moment from 'moment'
import config from '../tools/config'
import flying from './../assets/icons/flying.svg'
import './../css/views/view.css'

class Define extends Component {
  state = {
    submitted: false,
    saving: false,
    document: {
      fileId: this.props.match.params.fileId ? this.props.match.params.fileId : this.props.fileId,
      description: this.props.description ? this.props.description : undefined,
      pageNumber: undefined,
      publishedDate: undefined,
      startDate: undefined,
      endDate: undefined,
      tags: []
    }
  }

  handleChangeGenerator = (key, isDate = false) => event => {
    const { document } = this.state
    // DatePicker events are already the raw value
    const value = isDate ? event : event.target.value
    document[key] = value
    this.setState({ document })
  }

  handleChangeTags = tags => {
    const { document } = this.state
    document.tags = tags
    this.setState({ document })
  }

  handleSubmit = () => {
    const { document } = this.state
    const doc = {
      asset_id: parseInt(document.fileId, 10),
      description: document.description,
      asset_offset: parseInt(document.pageNumber, 10),
      published: moment(document.publishedDate).format(config.dateFormt),
      period_min: moment(document.startDate).format(config.dateFormt),
      period_max: moment(document.endDate).format(config.dateFormt),
      tags: document.tags
    }
    this.saveDocument(doc)
  }

  async saveDocument (document) {
    const { fileId } = this.state.document
    this.setState({ saving: true })
    const data = await this.props.fetcher.defineDocument(document)
    this.setState({ saving: false })
    this.props.sendMessage(data.messages[0], !data.success)
    if (data.success) { 
      this.setState({ saving: false })

      // if this is rendering inside the file view, trigger the parent to reload
      if (this.props.fileView) {
        this.props.postSave()

      // if not, redirect to the newly created document
      } else {
        this.props.history.push(`/defined/${fileId}/${data.data.document_id}`)
      }
    }
  }

  handleCancel = () => {
    this.props.history.push(`/files/${this.props.match.params.fileId}`)
  }

  // generates formbox styling with a label for an input element
  inForm = (label, children) => (
    <div className='formbox'>
      <div className='label'>{label}</div>
      {children}
    </div>
  )
  
  render () {
    const { saving } = this.props
    const { document } = this.state
    return (
      <div className='view'>
        {saving &&
          <div>
            <p className='preview-text'>Your document is being saved.</p>
            <Loader /> 
          </div>
        }
        {!saving &&
          <div className='document'>
            <Row>
              <Col xl='3' lg='3' md='12' sm='12'>
                <img className='option-img' src={flying} alt='flying paper airplane' />
              </Col>
              <Col xl='1' lg='1'></Col>
              <Col xl='8' lg='8' md='12' sm='12'>
                <div className='form'>
                  <div className='heading'>Define a new document.</div>
                  <div className='body'>
                    Each file can hold one or more documents. Explain a few things about the 
                    first document in this file. After that, you can add more documents if needed.
                  </div>
                  {this.inForm('file number',
                    <input
                      className='input'
                      name='fileId'
                      value={document.fileId}
                      disabled
                    />
                  )}
                  {this.inForm('description',
                    <input
                      className='input'
                      name='description'
                      value={document.description}
                      type='text'
                      placeholder='a description of the document'
                      onChange={this.handleChangeGenerator('description')}
                    />
                  )}
                  {this.inForm('page number',
                    <input
                      className='input'
                      name='pageNumber'
                      value={document.pageNumber}
                      type='number'
                      placeholder='the page it starts'
                      onChange={this.handleChangeGenerator('pageNumber')}
                    />
                  )}
                  {this.inForm('date published',
                    <DatePicker
                      className='input'
                      selected={document.publishedDate}
                      placeholderText='the date the document was published'
                      todayButton='Today'
                      maxDate={moment()}
                      onChange={this.handleChangeGenerator('publishedDate', true)}
                    />
                  )}
                  {this.inForm('start date',
                    <DatePicker
                      className='input'
                      selected={document.startDate}
                      placeholderText='the start date of the period it covers'
                      todayButton='Today'
                      maxDate={document.endDate}
                      onChange={this.handleChangeGenerator('startDate', true)}
                    />
                  )}
                  {this.inForm('end date',
                    <DatePicker
                      className='input'
                      selected={document.endDate}
                      placeholderText='the end date of the period it covers'
                      todayButton='Today'
                      minDate={document.startDate}
                      onChange={this.handleChangeGenerator('endDate', true)}
                    />
                  )}
                  {this.inForm('tags', 
                    <TagAdder
                      tags={document.tags}
                      fetcher={this.props.fetcher}
                      sendMessage={this.props.sendMessage}
                      updateTags={this.handleChangeTags}
                    />
                  )}
                  <Button className='submit' label='Add' onClick={this.handleSubmit} />
                  <Button className='cancel' label='Cancel' onClick={this.handleCancel} />
                </div>
              </Col>
            </Row>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(Define)
