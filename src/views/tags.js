import React, { Component } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import ReactTable from 'react-table'
import Button from '../components/atoms/button'
import Loader from '../components/atoms/loader'
import moment from 'moment'
import tag from '../assets/icons/tag.svg'
import edit from '../assets/icons/edit.svg'
import check from '../assets/icons/check.svg'
import deleted from '../assets/icons/delete.svg'
import plus from '../assets/icons/plus.svg'
import minus from '../assets/icons/minus.svg'
import 'react-table/react-table.css'
import './../css/views/view.css'

class Tags extends Component {
  state = {
    // fetching data
    tags: null,
    loading: false,
    expanded: {},

    // add tag functionality
    newTag: false,
    newName: '',

    // edit tag functionality
    editId: null,
    originalName: null,
    editName: '',

    // add alias functionality
    newAliasTagId: null,
    newAlias: '',

    // delete tag and alias functionality
    showModal: false,
    deleteId: null,
    deleteAlias: null,

    // table formatting
    relativeDates: false,
    filterDatesBy: 'month'
  }

  /* FETCHING DATA */

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
      this.setState({ tags: data.data, loading: false })
    }
  }

  /* ADD TAG FUNCTIONALITY */

  toggleAddTag = () => {
    const { newTag } = this.state
    this.setState({ newTag: !newTag, newName: '' })
  }

  handleNameChange = event => {
    this.setState({ newName: event.target.value })
  }

  handleNameKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleAddTag()
    }
  }

  handleAddTag = () => {
    const { newName } = this.state
    if (!newName) {
      this.setState({ newTag: false })
    } else {
      this.addTag(newName)
    }
  }

  async addTag (name) {
    this.setState({ loading: true })
    const data = await this.props.fetcher.addTag(name)

    this.setState({ loading: false })
    this.props.sendMessage(data.messages[0], !data.success)

    if (data.success) {
      this.setState({ newTag: false, newName: '' })
      await this.fetchTags()
    }
  }


  /* EDIT TAG FUNCTIONALITY */

  toggleEditTag = (tagId, name) => {
    let { editId, editName, originalName } = this.state
    editId = editId ? null : tagId
    editName = editId ? '' : name
    originalName = editId ? '' : name
    this.setState({ editId, editName, originalName })
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
    const { editId, editName, originalName } = this.state
    if (!editName || editName === originalName) {
      this.setState({ editId: null, editName: '', originalName: '' })
    } else {
      this.renameTag(editId, editName)
    }
  }

  async renameTag (id, newName) {
    this.setState({ loading: true })
    const data = await this.props.fetcher.renameTag(id, newName)

    this.setState({ loading: false })
    this.props.sendMessage(data.messages[0], !data.success)

    if (data.success) {
      this.setState({ editId: null, editName: '', originalName: '' })
      await this.fetchTags()
    }
  }


  /* CREATE ALIAS FUNCTIONALITY */

  toggleAddAlias = tagId => {
    let { newAliasTagId } = this.state
    newAliasTagId = newAliasTagId ? null : tagId
    this.setState({ newAliasTagId, newAlias: '' })
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
    const { newAliasTagId, newAlias } = this.state
    if (!newAlias) {
      this.setState({ newAliasId: null })
    } else {
      this.addAlias(newAliasTagId, newAlias)
    }
  }

  async addAlias (tagId, alias) {
    this.setState({ loading: true })
    const data = await this.props.fetcher.addTagAlias(tagId, alias)

    this.setState({ loading: false })
    this.props.sendMessage(data.messages[0], !data.success)

    if (data.success) {
      this.setState({ newAliasTagId: null, newAlias: '' })
      await this.fetchTags()
    }
  }


  /* DELETE TAG AND ALIAS FUNCTIONALITY */

  closeModal = () => {
    this.setState({ showModal: false, deleteId: null, deleteAlias: null })
  }

  showDeleteModal = id => {
    this.setState({ showModal: true, deleteId: id })
  }

  showDeleteAliasModal = (tagId, alias) => {
    this.setState({ showModal: true, deleteId: tagId, deleteAlias: alias })
  }

  closeButton = <Button label='&times;' onClick={this.closeModal} />

  handleDelete = () => {
      const { deleteAlias } = this.state
      if (deleteAlias) {
        this.deleteAlias()
      } else {
        this.deleteTag()
      }
  }

  async deleteTag () {
    const { deleteId } = this.state
    this.setState({ loading: true, showModal: false, deleteId: null, deleteAlias: null })
    const data = await this.props.fetcher.deleteTag(deleteId)

    this.setState({ loading: false })
    this.props.sendMessage(data.messages[0], !data.success)

    if (data.success) {
      await this.fetchTags()
    }
  }

  async deleteAlias () {
    const { deleteAlias, deleteId } = this.state
    this.setState({ loading: true, showModal: false, deleteId: null, deleteAlias: null })
    const data = await this.props.fetcher.removeTagAlias(deleteId, deleteAlias)

    this.setState({ loading: false })
    this.props.sendMessage(data.messages[0], !data.success)

    if (data.success) {
      await this.fetchTags()
    }
  }


  /* TABLE DATE FORMATTING AND FILTERING */

  toggleDateRender = () => {
    this.setState({ relativeDates: !this.state.relativeDates })
  }

  dateRender = row => (
    this.state.relativeDates ? moment(row.value).fromNow() : moment(row.value).format('l')
  )

  toggleDateFilter = () => {
    const filterDatesBy = this.state.filterDatesBy === 'day' ? 'month' : 'day'
    this.setState({ filterDatesBy })
  }

  dateFilter = (filter, row) => {
    if (moment(filter.value).isValid()) {
      let date = moment(filter.value)
      const today = moment()
      const rowDate = moment(row[filter.id])

      // this is the default year when no year is specified, so it's important to know whether this was
      // explicitly typed or set automatically by moment.js
      const typed2001 = filter.value.indexOf('2001') > -1

      // assume this year or last year if no year set
      if (date.year() === 2001 && !typed2001) {
        if (date.month() <= today.month()) { // if the month anything up until this month, assume this year
          date.year(today.year())
        } else { // if it's after this month, assume last year
          date.year(today.clone().subtract(1, 'year').year())
        }
      }

      // filter by day or month
      const { filterDatesBy } = this.state
      return date >= rowDate.clone().startOf(filterDatesBy) && date <= rowDate.clone().endOf(filterDatesBy)
    } else {
      // if the date typed is invalid, show no rows
      return false
    }
  }



  /* TABLE TEXT AND NUMBER FILTERING */

  textFilter = (filter, row) => {
    return row[filter.id].indexOf(filter.value) > -1
  }

  numberFilter = (filter, row) => {
    return row[filter.id].toString().indexOf(filter.value).toString() > -1
  }



  /* TABLE RENDERING AND FILTERING BY TAG */

  tagsRender = row => (
    row.value ? row.value.map(alias => (
      <Button className='table-tag' key={alias.name} label={alias.name} src={null} />
    )) : ''
  )

  tagsFilter = (filter, row) => {
    const typed = filter.value
    const rowTagIds = row[filter.id]

    const matches = rowTagIds.filter(rowTagId => {
      // check what was typed against each tag name
      let isAMatch = this.getTagName(rowTagId).indexOf(typed) > -1

      // if it's not a match and the tag has aliases, check those
      if (!isAMatch) {
        // get the tag object from state
        const tagObject = this.getTagObject(rowTagId)

        // check if it has synonyms, and if so, check if one of them matches
        if ('synonyms' in tagObject) {
          // check if each alias key value contains any of the typed string
          isAMatch = tagObject.synonyms.filter(alias => (
            alias.name.indexOf(typed) > -1
          )).length > 0
        }
      }

      // if either the tag name or one of the aliases matches, this tag is a match
      return isAMatch
    })

    // if there was at least one tag in the list of matches for this row, return true for the row
    return matches.length > 0
  }

  /*
  // adds or removes an alias from being selected
  toggleSelectAlias = name => {
    let { selectedAliases } = this.state
    if (selectedAliases.indexOf(name) > -1) {
      selectedAliases = selectedAliases.filter(aliasName => aliasName !== name)
    } else {
      selectedAliases.push(name)
    }
    this.setState({ selectedAliases })
  }
  */



  /* RENDERS THE ALIAS MANAGER SUBCOMPONENT TABLE */

  aliasColumns = [
    {
      Header: 'Name',
      accessor: 'name',
      id: 'name',
      filterMethod: this.textFilter,
      minWidth: 200
    },
    {
      Header: 'Created',
      accessor: 'timestamp',
      Cell: this.dateRender,
      filterMethod: this.dateFilter,
      minWidth: 170
    },
    {
      Header: 'Delete',
      accessor: 'name',
      id: 'delete',
      Cell: row => (
        <span className='table-button'>
          <Button
            src={deleted}
            label=''
            onClick={() => this.showDeleteAliasModal(row.original.tag_id, row.value)}
          />
        </span>
      ),
      filterable: false,
      sortable: false,
      minWidth: 100
    }
  ]

  aliasRender = row => (
    <div className='table-subcomponent'>
      <div className='header'>Alias Manager</div>
      <ReactTable
        className='-highlight'
        data={row.original.synonyms}
        columns={this.aliasColumns}
        defaultSorted={[{ id: 'name', desc: false }]}
        minRows={0}
        showPagination={false}
      />
      <div className='subtable-add-row'>
        <Button
          className='subtable-add-plus-button'
          src={this.state.newAliasTagId ? minus : plus}
          onClick={() => this.toggleAddAlias(row.original.tag_id)}
        />
        {!this.state.newAliasTagId && 
          <span
            className='table-add-text'
            onClick={() => this.toggleAddAlias(row.original.tag_id)}
          >
            Click here to add an alias.
          </span>
        }
        {this.state.newAliasTagId &&
          <span>
            <input 
              className='subtable-add-row-input'
              name='newAlias'
              placeholder='enter a name for the new alias'
              value={this.state.toggleAddAlias}
              onChange={this.handleAliasNameChange}
              onKeyPress={this.handleAliasKeyPress}
              onFocus={event => event.target.select()}
              autoFocus
            />
            <Button className='subtable-add-check-button' src={check} onClick={this.handleAddAlias} />
          </span>
        }
      </div>
    </div>
  )

  // highlights an expanded row with its alias manager subcomponent
  setExpandedRowStyle = (state, rowInfo, _) => {
    const rowExpanded = rowInfo && Object.keys(state.expanded).indexOf(rowInfo.index.toString()) > -1 ? state.expanded[rowInfo.index.toString()] : false
    if (rowExpanded) { 
      return {
        style: {
          margin: '5px 10px 30px 10px',
          borderRadius: '10px',
          backgroundColor: '#eee',
          border: '.5px solid #ddd !important',
          WebkitBoxShadow: '0 0 30px 0 #ddd',
          boxShadow: '0 0 20px 0 #ddd'
        }
      }
    } else {
      return {}
    }
  }


  /* RENDERS THE BASIC TABLE COLUMNS AND DATA */

  columns = [
    {
      Header: 'View',
      accessor: 'tag_id',
      Cell: row => (
        <span className='table-button'><Button src={tag} label='' link={`/tags/${row.value}`} /></span>
      ),
      filterable: false,
      sortable: false,
      minWidth: 80
    },
    {
      Header: 'Edit',
      accessor: 'tag_id',
      Cell: row => (
        <span className='table-button'><Button src={edit} label='' onClick={() => this.toggleEditTag(row.value, row.original.tag_name)} /></span>
      ),
      filterable: false,
      sortable: false,
      minWidth: 80
    },
    {
      Header: 'Name',
      accessor: 'tag_name',
      Cell: row => (
        // if this row has been set to be edited, display an edit UI
        this.state.editId === row.original.tag_id ? 
          <span>
            <input 
              className='table-edit-input'
              name='rename'
              placeholder='rename this tag'
              value={this.state.editName} 
              onChange={this.handleRenameChange}
              onKeyPress={this.handleRenameKeyPress}
              onFocus={event => event.target.select()}
              autoFocus
            />
            <Button className='table-input-button' src={check} onClick={this.handleRename}></Button>
          </span> :
          <span>{row.value}</span>
      ),
      filterMethod: this.textFilter,
      minWidth: 200
    },
    {
      Header: 'Uploaded',
      accessor: 'timestamp',
      Cell: this.dateRender,
      filterMethod: this.dateFilter,
      minWidth: 170
    },
    {
      Header: 'Aliases',
      accessor: 'synonyms',
      Cell: this.tagsRender,
      filterMethod: this.tagsFilter,
      minWidth: 150
    },
    {
      Header: 'Delete',
      accessor: 'tag_id',
      Cell: row => (
        <span className='table-button'>
          <Button src={deleted} label='' onClick={() => this.showDeleteModal(row.value) } />
        </span>
      ),
      filterable: false,
      sortable: false,
      minWidth: 100
    }
  ]

  
  /* RENDERS THE OVERALL VIEW AND MAIN TABLE */

  render () {
    const { tags, loading, newTag, newName, expanded, showModal, deleteId, deleteAlias, relativeDates, filterDatesBy } = this.state
    const loaded = tags ? true : false
    
    return (
      <div className='table-view'>
        <Modal isOpen={showModal} backdrop={true} close={this.closeButton}>
          <ModalBody>
            <p>Are you sure you want to delete this {deleteAlias ? 'alias' : 'tag'}?</p>
            <Button className='submit' label='Delete' onClick={this.handleDelete} />
            <Button className='cancel' label='Cancel' onClick={this.closeModal} />
            {!deleteAlias && 
              <Button className='reverse right' label='View Tag' link={`/tags/${deleteId}`} />
            }
          </ModalBody>
        </Modal>
        <h4 className='title'>Tag Manager</h4>
        {loading &&
          <Loader />
        }
        {loaded &&
          <span>
            <div className='table-controls'>
              <span className='table-controls-text'>View Options:</span>
              <Button
                className='reverse table-controls-button'
                label={relativeDates ? 'Using Relative Dates' : 'Using Absolute Dates'} 
                onClick={this.toggleDateRender}
              />
              <Button
                className='reverse table-controls-button'
                label={filterDatesBy === 'day' ? 'Dates Filtered by Day' : 'Dates Filtered by Month'}
                onClick={this.toggleDateFilter}
              />
              <div className='clear'></div>
            </div>
            <ReactTable
              className='-highlight'
              data={tags}
              columns={this.columns}
              SubComponent={this.aliasRender}
              minRows={1}
              defaultPageSize={10}
              showPagination={tags.length > 10}
              defaultSorted={[{ id: 'timestamp', desc: false }]}
              filterable
              expanded={expanded}
              getTrGroupProps={this.setExpandedRowStyle}
              onExpandedChange={(n, index, e) => {
                expanded[index] = expanded[index] ? false : true
                this.setState({ expanded })
                this.forceUpdate()
              }}
            />
            <div className='table-add-row'>
              <Button className='table-add-plus-button' src={newTag ? minus : plus} onClick={this.toggleAddTag} />
              {!newTag && <span className='table-add-text' onClick={this.toggleAddTag}>Click here to add a tag.</span>}
              {newTag &&
                <span>
                  <input 
                    className='table-add-row-input'
                    name='newName'
                    placeholder='enter a name for the new tag'
                    value={newName} 
                    onChange={this.handleNameChange}
                    onKeyPress={this.handleNameKeyPress}
                    onFocus={event => event.target.select()}
                    autoFocus
                  />
                  <Button className='table-add-check-button' src={check} onClick={this.handleAddTag} />
                </span>
              }
            </div>
          </span>
        }
        {!loading && !loaded &&
          <p className='preview-text'>A list of tags could not be displayed.</p>
        }
      </div>
    )
  }
}

export default Tags
