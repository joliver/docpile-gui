import React, { Component, Fragment } from 'react'
import { Transition } from 'react-spring'
import Loader from './loader'
import Tag from './tag'
import Button from './button'
import './../../css/atoms/tagAdder.css'

class TagAdder extends Component {
  state = {
    addedTags: [],
    /*
      // example tag search result object
      {
        "tag_id": 000,
        "text": "the tag's name",
        "synonym": false,
        "indexes": [ 0, 1, 2, 3 ] where in the text it matches up
      }
    */
    suggestedTags: [],
    text: '',
    loading: false,
    editing: true
  }

  async getTagResults (text) {
    if (text.length > 1) {
      this.setState({ loading: true })
      const data = await this.props.fetcher.searchTags(text)

      if (data.messages && data.messages.length > 0) {
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

  handleToggleEdit = () => {
    const { editing, addedTags } = this.state
    this.setState({ editing: !editing })
    if (!editing) {
      this.props.updateTags(addedTags)
    }
  }

  handleChange = event => {
    const { value } = event.target
    this.getTagResults(value)
    this.setState({ text: value })
  }

  handleKeyPress = event => {
    // create a new tag on enter
    if (event.target.key === 'Enter') {
      this.createTag(this.state.text)
    }
  }

  handleKeyDown = event => {
    // add the first match on tab
    if (event.target.key === 'Tab') {
      this.addTag(this.state.suggestedTags[0])
    }    
  }
  
  handleAddGenerator = tag => () => {
    this.addTag(tag)
  }

  addTag = tag => {
    let { addedTags, suggestedTags } = this.state
    addedTags.push(tag)
    suggestedTags = suggestedTags.filter(t => t.tag_id !== tag.tag_id)
    this.setState({ addedTags, suggestedTags, text: '' }) // clear out input
  }

  handleRemoveGenerator = tag => () => {
    this.removeTag(tag)
  }

  removeTag = tag => {
    let { addedTags } = this.state
    addedTags = addedTags.filter(t => t.tag_id !== tag.tag_id)
    this.setState({ addedTags })
  }

  handleCreateTag = () => {
    this.createTag()
  }

  async createTag () {
    const { text } = this.state
    this.setState({ loading: true })
    const data = await this.props.fetcher.addTag(text)
    this.props.sendMessage(data.messages[0], !data.success)
    if (data.success) {
      this.addTag({ tag_id: data.data.tag_id, text, synonym: false, bolded: [] })
    }
    this.setState({ loading: false })
  }
  
  render () {
    const { editing, loading, text, addedTags, suggestedTags } = this.state
    return (
      <div className='tag-adder'>
        {loading &&
          <Loader />
        }
        {!loading && 
          <Fragment>
            {editing &&
              <input 
                className='tag-adder-input'
                name='text'
                type='text'
                value={text}
                placeholder='Type to add a tag or see a list of suggested tags...'
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
                onKeyDown={this.handleKeyDown}
                onFocus={event => event.target.select()}
                autoFocus
              />
            }
            <div className='added-tags'>
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
                  onClick={this.tagHandleRemoveGenerator(tag)}
                />}
              </Transition>
            </div>
            {editing &&
              <Fragment>
                <div className='suggested-tags'>
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
                      onClick={this.tagHandleAddGenerator(tag)} 
                    />}
                  </Transition>
                  <Tag
                    label={`Add a new tag called "${text}"`}
                    onClick={this.handleCreateTag}
                  />
                </div>
              </Fragment>
            }
            <Button 
              className='submit'
              label={editing ? `I'm finished.` : 'Add some more tags.'}
              onClick={this.handleToggleEdit}
            />
          </Fragment>
        }
      </div>
    )
  }
}

export default TagAdder