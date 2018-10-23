import React, { Component } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import ReactTable from 'react-table'
import Button from '../components/atoms/button'
import Loader from '../components/atoms/loader'
import moment from 'moment'
import deleted from '../assets/icons/delete.svg'
import doc from '../assets/icons/doc.svg'
import file from '../assets/icons/file.svg'
import 'react-table/react-table.css'
import './../css/views/view.css'

class Documents extends Component {
  state = {
    documents: null,
    tags: null,
    loading: false,
    showModal: false,
    deleteId: null,
    relativeDates: false,
    filterDatesBy: 'month'
  }
  
  componentDidMount () {
    this.fetchTags()
    this.fetchDocuments()
  }
  
  async fetchDocuments () {
    this.setState({ loading: true })

    // check if this should pull documents for a particular file or all documents
    let data = null
    if (this.props.fileId) {
      data = await this.props.fetcher.getFileDocuments(this.props.fileId)
    } else if (this.props.tagId) {
      data = await this.props.fetcher.getTagDocuments(this.props.tagId)
    } else {
      data = await this.props.fetcher.getDocuments()
    }

    if (!data.success) { 
      this.props.sendMessage(data.messages[0], !data.success) 
    } else { 
      this.setState({ documents: data.data, loading: false })
    }
  }

  async fetchTags () {
    this.setState({ loading: true })
    const data = await this.props.fetcher.getTags()
    if (!data.success) {
      this.props.sendMessage(data.messages[0], !data.success)
    } else {
      this.setState({ tags: data.data, loading: false})
    }
  }

  getTagObject = id => (
    this.state.tags ? this.state.tags.filter(tag => (
        tag.tag_id === id
      ))[0]
    : {} // return an empty object if tags haven't loaded yet
  )

  getTagName = id => (
    this.getTagObject(id).tag_name
  )

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal, deleteId: null })
  }

  showDeleteModal = id => {
    this.setState({ showModal: true, deleteId: id })
  }

  handleDelete = id => {
    this.deleteDocument(id)
  }

  async deleteDocument (id) {
    this.setState({ loading: true, showModal: false, deleteId: null })
    const data = await this.props.fetcher.deleteDocument(id)

    this.setState({ loading: false })
    this.props.sendMessage(data.messages[0], !data.success)

    if (data.success) {
      await this.fetchDocuments()
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

  // later make its own component
  /*
  tagsRender = row => (
    row.value.map(tagId => (
      <span>
        <Button cssLabel='table-tag' id={`table-tag-${tagId}`} key={tagId} label={this.getTagName(tagId)} link={`/tags/${tagId}`} />
        {'synonyms' in this.getTagObject(tagId) &&
          <Tooltip placement="right" isOpen={true} target={`table-tag-${tagId}`}>
            {this.getTagObject(tagId).synonyms.map(alias => (
              <span>
                <div className='tooltip-list-title'>Aliases:</div>
                <div className='tooltip-list-item'>{alias.name}</div>
              </span>
            ))}
          </Tooltip>
        }
      </span>
    ))
  )
  */

  tagsRender = row => (
    row.value.map(tagId => (
      <Button cssLabel='table-tag' key={tagId} label={this.getTagName(tagId)} link={`/tags/${tagId}`} src={null} />
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

  columns = [
    {
      Header: 'View',
      accessor: 'document_id',
      style: { width: '40px' },
      Cell: row => (
        <span className='table-button'><Button src={doc} label='' link={`/documents/${row.value}`} /></span>
      ),
      filterable: false
    },
    {
      Header: 'Description',
      accessor: 'description',
      filterMethod: this.textFilter
    },
    {
      Header: 'Page',
      accessor: 'asset_offset',
      filterMethod: this.numberFilter
    },
    {
      Header: 'Uploaded',
      accessor: 'timestamp',
      Cell: this.dateRender,
      filterMethod: this.dateFilter
    },
    {
      Header: 'Published',
      accessor: 'published',
      Cell: this.dateRender,
      filterMethod: this.dateFilter
    },
    {
      Header: 'Start Date',
      accessor: 'period_min',
      Cell: this.dateRender,
      filterMethod: this.dateFilter
    },
    {
      Header: 'End Date',
      accessor: 'period_max',
      Cell: this.dateRender,
      filterMethod: this.dateFilter
    },
    {
      Header: 'Tags',
      accessor: 'tags',
      Cell: this.tagsRender,
      filterMethod: this.tagsFilter
    },
    // {
    //   Header: 'Documents',
    //   accessor: 'documents',
    //   filterable: false
    // }
    {
      Header: 'File',
      accessor: 'asset_id',
      style: { width: '40px' },
      Cell: row => (
        <span className='table-button'><Button src={file} label='' link={`/files/${row.value}`} /></span>
      ),
      filterable: false
    },
    {
      Header: 'Delete',
      accessor: 'document_id',
      style: { width: '40px' },
      Cell: row => (
        <span className='table-button'><Button src={deleted} label='' onClick={() => this.showDeleteModal(row.value)} /></span>
      ),
      filterable: false
    }
  ]

  fileColumns = this.columns.filter(column => (
    column.Header !== 'File'
  ))

  tagColumns = this.columns.filter(column => (
    column.Header !== 'Tags' && column.Header !== 'Delete'
  ))

  closeButton = <Button label='&times;' onClick={this.closeModal} />
  
  render () {
    const { documents, loading, showModal, deleteId, relativeDates, filterDatesBy } = this.state
    const loaded = documents ? true : false

    // set title and columns based on whether this is all documents, documents by file, documents by tag
    let title = this.props.fileId ? 'Documents in this File' : 'Documents'
    title = this.props.tagId ? 'Documents with this Tag' : title
    let columns = this.props.fileId ? this.fileColumns : this.columns
    columns = this.props.tagId ? this.tagColumns : columns

    return (
      <div className='table-view'>
        <Modal isOpen={showModal} toggle={this.toggleModal} backdrop={true} close={this.closeButton}>
          <ModalBody>
            <p>Are you sure you want to delete this document?</p>
            <Button cssLabel='submit' label='View Document' link={`/documents/${deleteId}`} />
            <Button cssLabel='submit' label='Delete' onClick={() => this.handleDelete(deleteId)} />
            <Button cssLabel='cancel' label='Cancel' onClick={this.toggleModal} />
          </ModalBody>
        </Modal>
        <h4 className='title'>{title}</h4>
        {loading &&
          <Loader />
        }
        {loaded &&
          <span>
            <div className='table-controls'>
              <span className='table-controls-text'>View Options:</span>
              <Button
                cssLabel='submit table-controls-button'
                label={relativeDates ? 'Using Relative Dates' : 'Using Absolute Dates'} 
                onClick={this.toggleDateRender}
              />
              <Button
                cssLabel='submit table-controls-button'
                label={filterDatesBy === 'day' ? 'Dates Filtered by Day' : 'Dates Filtered by Month'}
                onClick={this.toggleDateFilter}
              />
              {this.props.fileId &&
                <Button 
                  cssLabel='submit float-right table-controls-button'
                  label='Add another document to this file.' 
                  onClick={this.addDocument} />
              }
              <div className='clear'></div>
            </div>
            <ReactTable
              data={documents}
              columns={columns}
              minRows={3}
              defaultPageSize={10}
              filterable={true}
              noDataText='There are no documents in this list.'
              className='-striped -highlight'
            />
          </span>
        }
      </div>
    )
  }
}

export default Documents
