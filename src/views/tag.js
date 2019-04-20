import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import Loader from '../components/atoms/loader'
import Button from '../components/atoms/button'
import Documents from './documents'
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
              <p className='description'>View some information about a tag and its documents.</p>
            </div>
            <Button className='reverse' label='Rename Tag' />
            <Button className='reverse' label='Delete Tag' />
            <Button className='reverse' label='Remove Selected Aliases' />
            {this.inForm('date created',
              <input
                className='input'
                value={moment(tag.timestamp).format('MM/DD/YYYY h:mm:ss a')}
                disabled
              />
            )}
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
