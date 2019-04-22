import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, ModalBody } from 'reactstrap'
import moment from 'moment'
import Loader from '../components/atoms/loader'
import Button from '../components/atoms/button'
import Documents from './documents'
import tagicon from '../assets/icons/tag.svg'
import plus from '../assets/icons/plus.svg'
import minus from '../assets/icons/minus.svg'
import check from '../assets/icons/check.svg'
import './../css/views/view.css'

class Tag extends Component {
  state = {
    tag: null,
    loading: false,

    // edit tag functionality
    editing: false,
    editName: '',

    // add alias functionality
    addingAlias: false,
    newAlias: '',

    // delete tag and alias functionality
    showModal: false,
    deleteTag: false,
    deleteAliases: [],
    
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
      const tag = data.data

      // set generic unselected class name on each alias
      if (tag.synonyms && tag.synonyms.length > 0) {
        tag.synonyms.forEach(alias => {
          alias.className = 'table-tag'
        })
      }

      this.setState({ tag, loading: false })
    }
  }

  /* EDIT TAG FUNCTIONALITY */

  toggleEdit = () => {
    let { tag, editing, editName } = this.state
    editName = editing ? '' : tag.name
    this.setState({ editing: !editing, editName })
  }

  handleRenameChange = event => {
    this.setState({ editName: event.target.value })
  }

  handleRenameKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleRename()
    }
  }

  handleRename = () => {
    const { tag, editName } = this.state
    if (!editName || editName === tag.name) {
      this.setState({ editing: false, editName: '' })
    } else {
      this.renameTag(editName)
    }
  }

  async renameTag (newName) {
    this.setState({ loading: true })

    const { tag } = this.state
    const data = await this.props.fetcher.renameTag(tag.tag_id, newName)

    this.setState({ loading: false })
    this.props.sendMessage(data.messages[0], !data.success)

    if (data.success) {
      this.setState({ editing: false, editName: '' })
      await this.fetchTag()
    }
  }


  /* CREATE ALIAS FUNCTIONALITY */

  toggleAddAlias = () => {
    const { addingAlias } = this.state
    this.setState({ addingAlias: !addingAlias, newAlias: '' })
  }

  handleAliasNameChange = event => {
    this.setState({ newAlias: event.target.value })
  }

  handleAliasKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleAddAlias()
    }
  }

  handleAddAlias = () => {
    const { newAlias } = this.state
    if (!newAlias) {
      this.setState({ addingAlias: false })
    } else {
      this.addAlias(newAlias)
    }
  }

  async addAlias (alias) {
    this.setState({ loading: true })

    const { tag } = this.state
    const data = await this.props.fetcher.addTagAlias(tag.tag_id, alias)

    this.setState({ loading: false })
    this.props.sendMessage(data.messages[0], !data.success)

    if (data.success) {
      this.setState({ addingAlias: false, newAlias: '' })
      await this.fetchTag()
    }
  }


  /* DELETE TAG AND SELECT AND DELETE ALIAS FUNCTIONALITY */

  handleSelectAlias = alias => {
    let { deleteAliases } = this.state
    let selected = false
    deleteAliases.forEach(a => {
      if (a === alias) { selected = true }
    })
    if (selected) {
      deleteAliases = deleteAliases.filter(a => a !== alias)
    } else {
      deleteAliases.push(alias)
    }
    this.setState({ deleteAliases })
  }

  getAliasStyling = alias => {
    const { deleteAliases } = this.state
    let styling = 'table-tag'
    deleteAliases.forEach(a => {
      if (a === alias) { styling = 'table-tag selected-tag' }
    })
    return styling
  }

  closeModal = () => {
    this.setState({ showModal: false, deleteAliases: [] })
  }

  showDeleteModal = () => {
    this.setState({ showModal: true, deleteTag: true })
  }

  showDeleteAliasModal = () => {
    this.setState({ showModal: true, deleteTag: false })
  }

  closeButton = <Button label='&times;' onClick={this.closeModal} />

  handleDelete = () => {
      const { deleteAliases } = this.state
      if (deleteAliases.length > 0) {
        this.deleteAliases()
      } else {
        this.deleteTag()
      }
  }

  async deleteTag () {
    this.setState({ loading: true, showModal: false, deleteTag: false, deleteAliases: [] })

    const { tag } = this.state
    const data = await this.props.fetcher.deleteTag(tag.tag_id)

    this.setState({ loading: false })
    this.props.sendMessage(data.messages[0], !data.success)

    if (data.success) {
      this.props.history.push('/tags')
    }
  }

  async deleteAliases () {
    const { tag, deleteAliases } = this.state
    this.setState({ loading: true, showModal: false, deleteTag: false, deleteAliases: [] })

    const datas = []
    for (let i = 0; i < deleteAliases.length; i++) {
      const data = await this.props.fetcher.removeTagAlias(tag.tag_id, deleteAliases[i])
      datas.push(data)
    }

    this.setState({ loading: false })
    datas.forEach(data => {
      this.props.sendMessage(data.messages[0], !data.success)
    })
    await this.fetchTag()
  }

  render () {
    const { tag, loading, editing, addingAlias, showModal, deleteTag, deleteAliases } = this.state
    return (
      <div>
        {loading &&
          <Loader /> 
        }
        <Modal isOpen={showModal} backdrop={true} close={this.closeButton}>
          <ModalBody>
            <p>Are you sure you want to delete {deleteTag ? 'this tag' : (deleteAliases.length > 1 ? 'these aliases' : 'this alias')}?</p>
            <Button className='submit' label='Delete' onClick={this.handleDelete} />
            <Button className='cancel' label='Cancel' onClick={this.closeModal} />
          </ModalBody>
        </Modal>
        {!loading && tag &&
          <div>
            <img className='side-img-2' src={tagicon} alt='a tag' />
            <div className='segment-2'>
              <h4 className='header'>Tag: {tag.tag_name}</h4>
              <p className='description'>View some information about a tag and its documents.</p>
              <p className='description-2'>
                Created: {moment(tag.timestamp).format('MM/DD/YYYY h:mm:ss a')}
              </p>
              <div className='segment-3'>
                <Button className='table-add-plus-button' src={editing ? minus : plus} onClick={this.toggleEdit} />
                {!editing &&
                  <span className='plus-text-1' onClick={this.toggleEdit}>
                    Click here to rename this tag.
                  </span>
                }
                {editing &&
                  <span className='minus-text-1'>
                    <input 
                      className='minus-text-input'
                      name='rename'
                      placeholder='enter a new name for this tag'
                      value={this.state.editName} 
                      onChange={this.handleRenameChange}
                      onKeyPress={this.handleRenameKeyPress}
                      onFocus={event => event.target.select()}
                      autoFocus
                    />
                    <Button className='table-add-check-button' src={check} onClick={this.handleRename} />
                  </span>
                }
                <div className='clear'></div>
              </div>

              <div className='segment-3'>
                {tag.synonyms && tag.synonyms.length > 0 &&
                  <div className='aliases'>
                    {tag.synonyms.map(alias =>
                      <Button
                        className={this.getAliasStyling(alias.name)}
                        key={alias.name}
                        label={alias.name}
                        src={null}
                        onClick={e => this.handleSelectAlias(alias.name)}
                      />
                    )}
                    <div className='clear'></div>
                  </div>
                }
                <div className='clear'></div>
                <Button className='table-add-plus-button' src={addingAlias ? minus : plus} onClick={this.toggleAddAlias} />
                {!addingAlias &&
                  <span className='plus-text-2' onClick={this.toggleAddAlias}>
                    Click here to add an alias.
                  </span>
                }
                {addingAlias &&
                  <span className='minus-text-2'>
                    <input 
                      className='minus-text-input'
                      name='alias'
                      placeholder='enter a name for the alias'
                      value={this.state.newAlias}
                      onKeyPress={this.handleAliasKeyPress}
                      onChange={this.handleAliasNameChange}
                      onFocus={event => event.target.select()}
                      autoFocus        
                    />
                    <Button className='table-add-check-button' src={check} onClick={this.handleAddAlias} />
                  </span>
                }
                <div className='clear'></div>
                <Button className='submit' label='Remove Selected Aliases' onClick={this.showDeleteAliasModal} />
                <Button className='submit ml-2' label='Delete Tag' onClick={this.showDeleteModal} />
                <div className='clear'></div>
              </div>
            </div>
            <div className='clear'></div>
            <div className='table-view'>
              <Documents {...this.props} tagId={tag.tag_id} />
            </div>
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
