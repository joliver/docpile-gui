import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Tag from './../../components/atoms/tag'
import './../../css/forms/form.css'

class TagBox extends Component {
  state = {
    allTags: [],
    results: undefined,
    loading: false
  }

  componentDidMount () {
    this.fetchTags()
  }
  
  async fetchTags () {
    this.setState({ loading: true })
    const data = await this.props.fetcher.getTags()
    if (!data.success) { 
      this.props.sendMessage(data.messages[0], !data.success) 
    }
    else { 
      this.setState({ allTags: data.data, loading: false })
    }
  }

  async lookupTag (string) {
    const data = this.props.fetcher.searchTags(string)
    if (!data.success) { 
      this.props.sendMessage(data.messages[0], !data.success) 
    }
    else { 
      this.setState({ results: data.data })
    }
  }

  handleChange = (event) => {
    if (event.target.value.length > 2) {
      this.lookupTag(event.target.value)
    }
    this.props.onChange({ label: this.props.label, value: event.target.value })
  }

  getTagName = (id) => {
    let name = ''
    if (this.state.allTags) {
      name = this.state.allTags.filter((tag) => tag.tag_id === id)[0].tag_name
    }
    return name
  }
  
  render () {
    const { className, value } = this.props
    const { results, allTags } = this.state
    return (
      <div className={`compound-input ${className}`}>
        <input type='text' placeholder={this.props.placeholder} className='inner-input' onChange={this.handleChange} />
        <TagExtender className='tag-extender' tags={value} results={results} allTags={allTags} {...this.props} />
      </div>
    )
  }
}

// contains a collection of tags
const TagExtender = (props) => {
  const box = props.tags.map((tag) => {
    return (
      <Tag key={i} label={tag.tag_name}/>
    )
  })
}

TagBox.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  // value
  onChange: PropTypes.func.isRequired
}

export default TagBox