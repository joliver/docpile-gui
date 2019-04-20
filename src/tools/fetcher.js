// Singleton class for fetching data from API
/* global fetch */
import moment from 'moment'

class Fetcher {
  constructor () {
    this.url = 'http://localhost:8888'
  }
  
  
  /* UNIVERSAL METHODS */
  
  makeErrMessages = error => { // [ { fields: [ 'name' ], message: 'message' } ] OR 'message' OR empty
    const messages = []
    if (Array.isArray(error.data)) {
      for (let i=0; i < error.data.length; i++) {
        let msg = 'There was an error with the following fields: '
        for (let j=0; j < error.data[i].fields.length; j++) {
          let field = error.data[i].fields[j]
          if (field in this.convertFields) {
            field = this.convertFields[field]
          }
          msg += field // make error on field name more readable in UI
          if (j !== error.data[i].fields.length - 1) { msg += ', ' }
        }
        msg += '. '
        msg += this.convertMessageFields(error.data[i].message) // this may still contain server-related field names
        messages.push(msg)
      }
    } else if (typeof error.data === 'string') {
      messages.push(error.data)
    } else {
      if (error.code) {
        messages.push(`There is an error with status code ${error.code}.`)
      } else {
        messages.push('Something\'s wrong here.')
      }
    }
    return messages
  } // [ 'message', ... ]

  // alter error message text to be more compatible with UI
  convertMessageFields = message => {
    const fields = Object.keys(this.convertFields)
    fields.forEach(field => {
      message = message.replace(field, this.convertFields[field])
    })
    return message
  }

  // alter error field names to be more compatible with UI
  convertFields = {
    'managed asset filename': 'filename',
    'managed asset': 'file',
    'manged asset': 'file',
    'an max': 'a max',
    'more tag': 'more tags',
    storage: 'upload',
    ID: 'number',
    asset: 'file',
    asset_id: 'file',
    tag_id: 'tag number',
    synonym: 'alias',
    synonyms: 'aliases',
    document_id: 'document number',
    period_min: 'start date',
    period_max: 'end date',
    published_min: 'date published',
    published_max: 'date published',
    text: 'search text'
  }

  async fetchIt (route, method, body=null, isFile=false) { // route + method are strings, body is an object
    try {
      const urlRoute = this.url + route
      let response = null
      if (body) {
        if (isFile) {
          const file = new FormData()
          file.append('file', body)
          response = await fetch (urlRoute, {
            method: method.toUpperCase(),
            headers: { 'Origin': 'local' },
            body: file
          })
        } else {
          response = await fetch (urlRoute, {
            method: method.toUpperCase(),
            headers: { 'Content-Type': 'application/json' , 'Origin': 'local' },
            body: JSON.stringify(body)
          })
        }
      } else { 
        response = await fetch (urlRoute, {
          method: method.toUpperCase(),
          headers: { 'Content-Type': 'application/json', 'Origin': 'local' }
        })
      }
      const code = response.status

      // this handles empty 200 responses from the server
      let data = null
      try {
        data = await response.json()
      } catch (data) { 
        /* eslint-disable no-throw-literal */
        if (code !== 200 && code !== 201) { throw { code, data } }
      }
      
      /* eslint-disable no-throw-literal */
      if (code !== 200 && code !== 201) { throw { code, data } }

      return { success: true, messages: null, data }
      // { success: true, messages: null, data: { --- } }
             
    } catch (error) {
      const messages = this.makeErrMessages(error)
      return { success: false, status: error.code, messages, data: error.data }
      // { success: false, status: 000, messages: [ 'message' ], data: [ { fields: [ 'name' ], message: 'error' } ] }
    }
  }
 
 
  /* Tags Routes */
 
  async getTags () {
    const data = await this.fetchIt('/tags', 'GET')
    if (data.success) { 
      // standardize synonyms to an array of objects
      data.data.forEach((tag) => {
        const synonyms = []
        if (tag.synonyms) {
          for (let key in tag.synonyms) {
            synonyms.push( { name: key, timestamp: tag.synonyms[key], tag_id: tag.tag_id } )
          }
          tag.synonyms = synonyms
        }
      })
    }
    return data // { success: true, messages: null, data: [ { ---tag object--- }, ... ] }
  }

  async getTag (tagId) {
    const route = `/tags/${tagId}`
    const data = await this.fetchIt(route, 'GET')
    /* 
      // example tag object
      {
        "tag_id": 000,
        "timestamp": "2012-12-12T00:00:00Z",
        "tag_name": "tag",
        "synonyms": {
          "name": "2012-12-12T00:00:00Z"
        }
      }
    */
    if (data.success) { 
      /*
        // standardize synonyms to an array of objects
        data.data.synonyms = [
          { name: "name", timestamp: "2012-12-12T00:00:00Z", tag_id: 000 },
          { ... }
        ]
      */
      const synonyms = []
      for (let key in data.data.synonyms) {
        synonyms.push( { name: key, timestamp: data.data.synonyms[key], tag_id: data.data.tag_id } )
      }
      data.data.synonyms = synonyms
    }
    return data // { success: true, messages: null, data: { ---tag object--- } }
  }
  
  async addTag (name) {
    const data = await this.fetchIt('/tags', 'PUT', { name })
    if (data.success) { 
      data.messages = [ `Tag "${name}" successfully created.` ]
      data.data = { tag_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { tag_id: 000 } }
  }
  
  async renameTag (tagId, newName) {
    const route = `/tags/${tagId}/name`
    const data = await this.fetchIt(route, 'POST', { name: newName })
    if (data.success) { 
      data.messages = [ `Tag successfully renamed to "${newName}."` ] 
      data.data = { tag_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { tag_id: 000 } }
  }
  
  async addTagAlias (tagId, alias) {
    const route = `/tags/${tagId}/name`
    const data = await this.fetchIt(route, 'PUT', { name: alias })
    if (data.success) {
      data.messages = [ `Alias "${alias}" successfully created.` ]
      data.data = { tag_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { tag_id: 000 } }
  }
  
  async removeTagAlias (tagId, alias) {
    const route = `/tags/${tagId}/name`
    const data = await this.fetchIt(route, 'DELETE', { name: alias })
    if (data.success) {
      data.messages = [ `Alias "${alias}" successfully removed.` ]
      data.data = { tag_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { tag_id: 000 } }
  }
  
  async deleteTag (tagId) {
    const route = `/tags/${tagId}`
    const data = await this.fetchIt(route, 'DELETE')
    if (data.success) { 
      data.messages = [ `Tag successfully deleted.` ] 
      data.data = null
    }
    return data // { success: true, messages: [ 'success' ], data: null }
  }


  /* Assets Routes */
  
  async getDocuments () {
    const data = await this.fetchIt('/documents', 'GET')
    return data // { success: true, messages: null, data: [ { ---document object--- }, ... ] }
  }

  async getFileDocuments (fileId) {
    const data = await this.fetchIt('/documents', 'GET')
    if (data.success) {
      const docs = data.data.filter(doc => {
        return doc.asset_id.toString() === fileId.toString() // fileId sometimes is passed as a string
    })
      data.data = docs
    }
    return data // { success: true, messages: null, data: [ { ---document object from file--- }, ... ] }
  }

  async getTagDocuments (tagId) {
    const data = await this.fetchIt('/documents', 'GET')
    if (data.success) {
      const docs = data.data.filter(doc => {
        if (doc.tags) {
          return doc.tags.includes(tagId)
        }
        return false
      })
      data.data = docs
    }
    return data // { success: true, messages: null, data: [ { ---document object labeled by tag--- }, ... ] }
  }

  async getDocument (docId) {
    const route = `/documents/${docId}`
    const data = await this.fetchIt(route, 'GET')
    /* 
      // example document object
      {
      	"asset_id": 000,
  	    "asset_offset": 0,
  	    "published": "2012-12-12T00:00:00Z",
  	    "period_min": "2012-12-12T00:00:00Z",
      	"period_max": "2012-12-13T00:00:00Z",
      	"tags": [ 000, ... ],
      	"documents": [ 000, ... ],
      	"description": "testing"
      }
    */
    return data // { success: true, messages: null, data: { ---document object--- } }
  }

  async uploadAsset (file) {
    const data = await this.fetchIt('/assets', 'PUT', file, true)
    if (data.success) { 
      data.messages = [ 'File successfully uploaded.' ]
      data.data = { asset_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { asset_id: 000 } }
  }

  async defineDocument (body) {
    const data = await this.fetchIt('/documents', 'PUT', body)
    /* 
      // example request body, all but asset_id may be omitted
      {
      	"asset_id": 000,
  	    "asset_offset": 0,
  	    "published": "2012-12-12T00:00:00Z",
  	    "period_min": "2012-12-12T00:00:00Z",
      	"period_max": "2012-12-13T00:00:00Z",
      	"tags": [ 000, ... ],
      	"documents": [ 000, ... ],
      	"description": "testing"
      }
    */
    if (data.success) { 
      data.messages = [ 'Document successfully defined.' ] 
      data.data = { document_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { document_id: 000 } }
  }

  async removeDocument (docId) {
    const route = `/documents/${docId}`
    const data = await this.fetchIt(route, 'DELETE')
    if (data.success) { 
      data.messages = [ 'Document successfully deleted.' ] 
      data.data = null
    }
    return data // { success: true, messages: [ 'success' ], data: null }
  }


  /* Search Routes */
  
  async searchDocuments (string, limiters) { // limiters is an array of key, value pairs
    const body = {
      text: string
    }
    // possible date limiter keys include: published_min, published_max, period_min, period_max
    limiters.forEach(limiter => {
      body[limiter.key] = limiter.value
    })
    // at least one date limiter is required
    if (limiters.length === 0) {
      body["published_max"] = moment(moment(), 'YYYY-MM-DDTHH:mm:ss')
    }
    const data = await this.fetchIt('/search/documents', 'POST', body)
    return data // { success: true, messages: null, data: [ { ---document object--- }, ... ] }
  }

  async searchTags (string) {
    const data = await this.fetchIt('/search/tags', 'POST', { text: string })
    /*
      // example response object
      {
        "tag_id": 000,
        "text": "the tag's name",
        "synonym": false,
        "indexes": [ 0, 1, 2, 3 ] // where in the text it matches up
      }
    */
    
    // mock response as currently tag search doesn't return results
    if (!data.success) {
      return data // { success: true, messages: null, data: [ { ---tag search response object--- }, ... ] }
    }
    return {
      success: true,
      messages: null,
      data: [ 
        { tag_id: 1549148639,
          text: "alias",
          synonym: true,
          indexes: [0, 1, 2, 3]
        },
        { tag_id: 1549148639,
          text: "testing",
          synonym: false,
          indexes: [2, 3]
        },
        { tag_id: 1549247562,
          text: "add a tag",
          synonym: false,
          indexes: [6, 7, 8]
        },
        { tag_id: 1549247831,
          text: "testingasdfjaklsdfjkl",
          synonym: false,
          indexes: [15, 16, 17]
        },
      ]
    }
  }
}

export default Fetcher