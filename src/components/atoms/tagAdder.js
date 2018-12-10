import React, { Component } from 'react'
import { Transition } from 'react-spring'
import { Tag } from './../../components/atoms/tag'
import './../../css/atoms/tagAdder.css'

class TagAdder extends Component {
  state = {
    addedTags: [],
    suggestedTags: [],
    text: '',
    loading: false
  }

  /*
    // example tag search result object
    {
      "tag_id": 000,
      "text": "the tag's name",
      "synonym": false,
      "indexes": [ 0, 1, 2, 3 ] // where in the text it matches up
    }
  */

  async getTagResults (text) {
    if (text.length > 1) {
      this.setState({ loading: true })
      const data = await this.props.fetcher.searchTags(text)
      if (data.messages.length > 0) {
        this.props.sendMessage(data.messages[0], !data.success)
      }
      if (data.success) {
        // filter out already added tags
        const suggestedTags = data.data.filter(suggestedTag => {
          this.state.addedTags.forEach(addedTag => {
            if (addedTag.tag_id === suggestedTag.tag_id) { return false }
          })
          return true
        })
        this.setState({ suggestedTags })
      }
      this.setState({ loading: false })
    }
  }

  handleChange = ({ target: { value } }) => {
    this.setState({ text: value })
    this.getTagResults(value)
  }

  addTag = tag => {
    const { addedTags, suggestedTags } = this.state
    addedTags.push(tag)
    suggestedTags = suggestedTags.filter(t => t.tag_id !== tag.tag_id)
    this.setState({ addedTags, suggestedTags })
    this.props.addTag(tag.tag_id)
  }

  tagOnClickGenerator = tag => () => {
    this.addTag(tag)
  }

  async createNewTag (name) {
    this.setState({ loading: true })
    const data = await this.props.fetcher.addTag(name)
    this.props.sendMessage(data.messages[0], !data.success)
    if (data.success) {
      this.addTag({ tag_id: data.data.tag_id, text: name, synonym: false, bolded: [] })
    }
    this.setState({ loading: false })
  }

  addNewTag = tag => {
    this.createNewTag(tag)
  }
  
  render () {
    const { addedTags, suggestedTags, text } = this.state
    return (
      <div className='tag-adder'>
        <input 
          className='tag-adder-input'
          name='tag-adder-input'
          type='text'
          value={text}
          placeholder='type to add a tag or see a list of suggested tags'
          onChange={this.handleChange}
        />
        <Transition
          items={addedTags}
          keys={item => item.key}
          from={{ opacity: 0, width: 0, }}
          enter={[{ opacity: 1, width: 'auto' }]}
          leave={[{ opacity: 0, width: 0 }]}
        >
          {tag => styles => <Tag
            style={styles}
            label={tag.text}
            alias={tag.synonym}
            link={`../tags/${tag.tag_id}`}
          />}
        </Transition>
        <Transition
          items={suggestedTags}
          keys={item => item.tag_id}
          from={{ opacity: 0, width: 0, }}
          enter={{ opacity: 1, width: 'auto' }}
          leave={{ opacity: 0, width: 0 }}
        >
          {tag => styles => <Tag 
            style={styles}
            label={tag.text}
            alias={tag.synonym}
            bolded={tag.indexes}
            onClick={this.tagOnClickGenerator(tag)} 
          />}
        </Transition>
        <Tag
          label={`add tag: ${text}`}
          onClick={this.createNewTag}
        /> 
      </div>
    )
  }
}

export default TagAdder