import React, { Component } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import ReactTable from 'react-table'
import Button from '../components/atoms/button'
import Loader from '../components/atoms/loader'
import moment from 'moment'
import deleted from '../assets/icons/delete.svg'
import tag from '../assets/icons/tag.svg'
import 'react-table/react-table.css'
import './../css/views/view.css'

class Tags extends Component {
  state = {
    tags: null,
    loading: false,
    showModal: false,
    deleteId: null,
    deleteAlias: null,
    relativeDates: false,
    filterDatesBy: 'month'
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
      this.setState({ tags: data.data, loading: false })
    }
  }

  closeModal = () => {
    this.setState({ showModal: false, deleteID: null, deleteAlias: null })
  }

  showDeleteModal = id => {
    this.setState({ showModal: true, deleteId: id })
  }

  showDeleteAliasModal = alias => {
    this.setState({ showModal: true, deleteAlias: alias })
  }

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

  textFilter = (filter, row) => {
    return row[filter.id].indexOf(filter.value) > -1
  }

  numberFilter = (filter, row) => {
    return row[filter.id].toString().indexOf(filter.value).toString() > -1
  }

  // adds or removes an alias from being selected for a given tag
  toggleSelectAlias = name => {
    let { selectedAliases } = this.state
    if (selectedAliases.indexOf(name) > -1) {
      selectedAliases = selectedAliases.filter(aliasName => aliasName !== name)
    } else {
      selectedAliases.push(name)
    }
    this.setState({ selectedAliases })
  }

  tagsRender = row => (
    row.value.map(alias => (
      <Button cssLabel='table-tag' key={alias.name} label={alias.name} onClick={() => this.toggleSelectAlias(alias.name)} src={null} />
    ))
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

  aliasRender = ({ original }) => (
    <div className='table-subcomponent'>
      <h6 className='header'>Alias Manager</h6>
      <ReactTable
        className='-highlight'
        data={original.synonyms}
        columns={this.aliasColumns}
        defaultSorted={[{ id: 'name', desc: false }]}
        minRows={1}
        showPagination={false}
      />
    </div>
  )

  // sets specific style to highlight an an expanded row with its alias manager subcomponent
  setExpandedRowStyle = (state, rowInfo, _) => {
    const rowExpanded = rowInfo && Object.keys(state.expanded).indexOf(rowInfo.index.toString()) > -1 ? state.expanded[rowInfo.index.toString()] : false
    if (rowExpanded) { 
      return {
        style: {
          margin: '5px 10px 30px 10px',
          borderRadius: '10px',
          backgroundColor: '#eee', // #f0fafa lightened $primary-light = $teal, hardcoded #e1f5f6
          border: '.5px solid #ddd !important', // #d2f0f2
          WebkitBoxShadow: '0 0 30px 0 #ddd', // #d2f0f2
          boxShadow: '0 0 20px 0 #ddd' // #d2f0f2 $primary-light = $teal, hardcoded #6acfd6
        }
      }
    } else {
      return {}
    }
  }

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
        <span className='table-button'><Button src={deleted} label='' onClick={() => this.showDeleteAliasModal(row.value)} /></span>
      ),
      filterable: false,
      sortable: false,
      width: 100
    }
  ]

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
      Header: 'Name',
      accessor: 'tag_name',
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
        <span className='table-button'><Button src={deleted} label='' onClick={() => this.showDeleteModal(row.value)} /></span>
      ),
      filterable: false,
      sortable: false,
      width: 100
    }
  ]

  closeButton = <Button label='&times;' onClick={this.closeModal} />
  
  render () {
    const { tags, loading, showModal, deleteId, deleteAlias, relativeDates, filterDatesBy } = this.state
    const loaded = tags ? true : false
    return (
      <div className='table-view'>
        <Modal isOpen={showModal} backdrop={true} close={this.closeButton}>
          <ModalBody>
            <p>Are you sure you want to delete this {deleteAlias ? 'alias' : 'tag'}?</p>
            <Button cssLabel='submit' label='Delete' onClick={this.handleDelete} />
            <Button cssLabel='cancel' label='Cancel' onClick={this.closeModal} />
            {!deleteAlias && 
              <Button cssLabel='reverse right' label='View Tag' link={`/tags/${deleteId}`} />
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
                cssLabel='reverse table-controls-button'
                label={relativeDates ? 'Using Relative Dates' : 'Using Absolute Dates'} 
                onClick={this.toggleDateRender}
              />
              <Button
                cssLabel='reverse table-controls-button'
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
              minRows={3}
              defaultPageSize={10}
              showPagination={tags.length > 10}
              defaultSorted={[{ id: 'timestamp', desc: false }]}
              filterable
              noDataText='There are no tags in this list.'
              getTrGroupProps={this.setExpandedRowStyle}
              onExpandedChange={() => { this.forceUpdate() }}
            />
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
