import React, { Component } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import ReactTable from 'react-table'
import Button from '../components/atoms/button'
import Loader from '../components/atoms/loader'
import moment from 'moment'
import doc from '../assets/icons/doc.svg'
import file from '../assets/icons/file.svg'
import deleted from '../assets/icons/delete.svg'
import plus from '../assets/icons/plus.svg'
import check from '../assets/icons/check.svg'
import 'react-table/react-table.css'
import './../css/views/view.css'

class Documents extends Component {
  state = {
    // fetch data
    documents: null,
    tags: null,
    loading: false,

    // add functionality (for file view only)
    newDoc: false,
    newDocDesc: '',

    // delete functionality
    showModal: false,
    deleteId: null,

    // table formatting
    relativeDates: false,
    filterDatesBy: 'month'
  }
  

  
  /* FETCHINg DATA */

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



  /* ADD DOCUMENT FUNCTIONALITY (FOR FILE VIEW ONLY) */

  toggleAddDocument = () => {
    this.setState({ newDoc: !this.state.newDoc, newDocDesc: '' })
  }

  handleDescriptionChange = event => {
    this.setState({ newDocDesc: event.target.value })
  }

  handleAddDocument = () => {
    const { newDoc, newDocDesc } = this.state
    if (!newDocDesc) {
      this.setState({ newDoc: false })
    } else {
      this.addDocument(newDocDesc)
    }
  }

  async addDocument (description) {
    this.setState({ loading: true })
    /* also need these values:
      	"asset_offset": 0,
  	    "published": "2012-12-12T00:00:00Z",
  	    "period_min": "2012-12-12T00:00:00Z",
      	"period_max": "2012-12-13T00:00:00Z",
      	"tags": [ 000, ... ],
    */
    // const data = await this.props.fetcher.defineDocument(body)

    this.setState({ loading: false })
    this.props.sendMessage('test message new document', false) // data.messages[0], !data.success)

    if (true) { // data.success) {
      this.setState({ newDoc: false, newDocDesc: '' })
      await this.fetchDocuments()
    }
  }



  /* DELETE DOCUMENT FUNCTIONALITY */

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

  closeButton = <Button label='&times;' onClick={this.closeModal} />



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
    row.value.map(tagId => (
      <Button cssLabel='table-tag' key={tagId} label={this.getTagName(tagId)} link={`/tags/${tagId}`} src={null} />
    ))
  )

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



  /* TAG MANAGER SUBCOMPONENT */

  // Some time when tags are allowed to be interactively added and removed from a document,
  // add a tag manager sub component, similar to the alias manager subcomponent in the tags view.

  /* RENDERS THE TAG MANAGER SUBCOMPONENT TABLE */

  /*

  tagColumns = [
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
      Header: 'Remove',
      accessor: 'name',
      id: 'delete',
      Cell: row => (
        <span className='table-button'><Button src={deleted} label='' onClick={() => this.removeTag(row.value)} /></span>
      ),
      filterable: false,
      sortable: false,
      width: 100
    }
  ]

  tagManagerRender = ({ original }) => (
    <div className='table-subcomponent'>
      <h6 className='header'>Tag Manager</h6>
      <ReactTable
        className='-highlight'
        data={original.tags}
        columns={this.tagColumns}
        defaultSorted={[{ id: 'name', desc: false }]}
        minRows={0}
        showPagination={false}
      />
      <div className='subtable-add-row'>
        <Button cssLabel='subtable-add-plus-button' src={plus} onClick={() => this.toggleAddTag(original.tag_id)} />
        {this.state.newAliasTagId &&
          <span>
            <input 
              className='subtable-add-row-input'
              name='newTag'
              placeholder='enter a name for the new tag'
              value={this.state.toggleAddTag} 
              onChange={this.handleTagNameChange}
            />
            <Button cssLabel='subtable-add-check-button' src={check} onClick={this.handleAddTag} />
          </span>
        }
      </div>
    </div>
  )

  // highlights an expanded row with its tag manager subcomponent
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

  // This should render a modal and/or just create a new tag if a tag being added doesn't exist.
  // It should potentially also suggest existing tags, similar to the search UI.

  */



  /* RENDERS THE BASIC TABLE COLUMNS AND DATA */

  columns = [
    {
      Header: 'View',
      accessor: 'document_id',
      Cell: row => (
        <span className='table-button'><Button src={doc} label='' link={`/documents/${row.value}`} /></span>
      ),
      filterable: false,
      sortable: false,
      minWidth: 80
    },
    {
      Header: 'Description',
      accessor: 'description',
      filterMethod: this.textFilter,
      minWidth: 200
    },
    {
      Header: 'Page',
      accessor: 'asset_offset',
      filterMethod: this.numberFilter,
      minWidth: 100
    },
    {
      Header: 'Uploaded',
      accessor: 'timestamp',
      Cell: this.dateRender,
      filterMethod: this.dateFilter,
      minWidth: 170
    },
    {
      Header: 'Published',
      accessor: 'published',
      Cell: this.dateRender,
      filterMethod: this.dateFilter,
      minWidth: 170
    },
    {
      Header: 'Start Date',
      accessor: 'period_min',
      Cell: this.dateRender,
      filterMethod: this.dateFilter,
      minWidth: 170
    },
    {
      Header: 'End Date',
      accessor: 'period_max',
      Cell: this.dateRender,
      filterMethod: this.dateFilter,
      minWidth: 170
    },
    {
      Header: 'Tags',
      accessor: 'tags',
      Cell: this.tagsRender,
      filterMethod: this.tagsFilter,
      minWidth: 150
    },
    // {
    //   Header: 'Documents',
    //   accessor: 'documents',
    //   filterable: false
    // }
    {
      Header: 'File',
      accessor: 'asset_id',
      Cell: row => (
        <span className='table-button'><Button src={file} label='' link={`/files/${row.value}`} /></span>
      ),
      filterable: false,
      sortable: false,
      width: 80
    },
    {
      Header: 'Delete',
      accessor: 'document_id',
      Cell: row => (
        <span className='table-button'><Button src={deleted} label='' onClick={() => this.showDeleteModal(row.value)} /></span>
      ),
      filterable: false,
      sortable: false,
      width: 100
    }
  ]


  /* FILTERS THE TABLE COLUMNS FOR FILE-DOCUMENTS and TAG-DOCUMENTS VIEWS */

  fileColumns = this.columns.filter(column => (
    column.Header !== 'File'
  ))

  tagColumns = this.columns.filter(column => (
    column.Header !== 'Tags' && column.Header !== 'Delete'
  ))



  /* RENDERS THE OVERALL VIEW AND MAIN TABLE */
  
  render () {
    const { documents, loading, newDoc, newDocDesc, showModal, deleteId, relativeDates, filterDatesBy } = this.state
    const loaded = documents ? true : false

    // set title and columns based on whether this is all documents, documents by file, documents by tag
    let title = this.props.fileId ? 'Documents in this File' : 'All Documents'
    title = this.props.tagId ? 'Documents with this Tag' : title
    let columns = this.props.fileId ? this.fileColumns : this.columns
    columns = this.props.tagId ? this.tagColumns : columns
    const titleClass = !this.props.fileId && !this.props.tagId ? 'title' : 'header'

    return (
      <div className='table-view documents-view'>
        <Modal isOpen={showModal} toggle={this.toggleModal} backdrop={true} close={this.closeButton}>
          <ModalBody>
            <p>Are you sure you want to delete this document?</p>
            <Button cssLabel='submit ml-1' label='View Document' link={`/documents/${deleteId}`} />
            <Button cssLabel='submit ml-2' label='Delete' onClick={() => this.handleDelete(deleteId)} />
            <Button cssLabel='cancel right' label='Cancel' onClick={this.toggleModal} />
          </ModalBody>
        </Modal>
        <h4 className={titleClass}>{title}</h4>
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
              data={documents}
              columns={columns}
              minRows={3}
              defaultPageSize={10}
              showPagination={documents.length > 10}
              defaultSorted={[{ id: 'timestamp', desc: false }]}
              filterable
              noDataText='There are no documents in this list.'
            />
            {this.props.fileId &&
              <div className='table-add-row'>
                <Button cssLabel='table-add-plus-button' src={plus} onClick={this.toggleAddDocument} />
                {newDoc &&
                  <span>
                    <input 
                      className='table-add-row-input'
                      name='newDocDesc'
                      placeholder='to add a document, first enter a description for the new document'
                      value={newDocDesc} 
                      onChange={this.handleDescriptionChange}
                    />
                    <Button cssLabel='table-add-check-button' src={check} onClick={this.handleAddDocument} />
                  </span>
                }
              </div>
            }
          </span>
        }
        {!loading && !loaded &&
          <p className='preview-text'>A list of documents could not be displayed.</p>
        }
      </div>
    )
  }
}

export default Documents
