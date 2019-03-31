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

  componentDidMount() {
    this.setAddedTags()
  }

  // set already added tags to display
  setAddedTags = () => {
    const addedTags = []
    // align tag objects to match tag search results objects
    this.props.tags.forEach(tag => {
      addedTags.push({
        key: tag.tag_name,
        tag_id: tag.tag_id,
        text: tag.tag_name,
        synonym: false
      })
    })
    this.setState({ addedTags })
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
            if (addedTag.tag_id === suggestedTag.tag_id) {
              return false 
            }
          })
          return true
        })

        // add a key property to each tag
        suggestedTags.forEach(tag => {
          tag.key = tag.text
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
    if (event.key === 'Enter') {
      this.createTag(this.state.text)
    }
  }

  handleKeyDown = event => {
    // add the first match on tab
    if (event.key === 'Tab' && this.state.suggestedTags.length !== 0) {
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
    this.setState({ addedTags, suggestedTags })
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
      this.addTag({ tag_id: data.data.tag_id, text, synonym: false, indexes: [] })
    }
    this.setState({ loading: false })
  }
  
  render () {
    const { editing, loading, text, addedTags, suggestedTags } = this.state
    return (
      <div className='tag-adder input'>
        {loading &&
          <Loader />
        }
        {!loading && 
          <Fragment>
            {editing &&
              <input 
                className='input'
                name='text'
                type='text'
                value={text}
                placeholder='Type to add a tag or see a list of suggested tags...'
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
                onKeyDown={this.handleKeyDown}
                // onFocus={event => event.target.select()}
                // autoFocus
              />
            }
            { addedTags.length > 0 &&
              <div className='added-tags'>
                <div className='tag-adder-text'>
                  Added Tags ... click to remove.
                </div>
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
                    added
                    onClick={this.handleRemoveGenerator(tag)}
                  />}
                </Transition>
              </div>
            }
            <div className='clear'></div>
            {editing && suggestedTags.length > 0 &&
              <Fragment>
                <div className='suggested-tags'>
                  <div className='tag-adder-text'>
                    Suggested Tags ... click to add.
                  </div>
                  <Transition
                    items={this.state.suggestedTags}
                    keys={item => item.key}
                    from={{ opacity: 0, width: 0, }}
                    enter={{ opacity: 1, width: 'auto' }}
                    leave={{ opacity: 0, width: 0 }}
                  >
                    {tag => styles => <Tag 
                      style={styles}
                      label={tag.text}
                      alias={tag.synonym}
                      bolded={tag.indexes}
                      onClick={this.handleAddGenerator(tag)} 
                    />}
                  </Transition>
                  <Tag
                    className={text === "" ? 'hidden' : ''}
                    label={`Add a new tag called "${text}"`}
                    onClick={this.handleCreateTag}
                  />
                </div>
              </Fragment>
            }
            <div className='clear'></div>
            <Button 
              className='submit m-1'
              label={editing ? `Done` : 'Add more tags.'}
              onClick={this.handleToggleEdit}
            />
            <div className='clear'></div>
          </Fragment>
        }
      </div>
    )
  }
}

export default TagAdder