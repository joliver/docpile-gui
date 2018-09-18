// Singleton class for fetching data from API
/* global fetch */
import moment from 'moment'

class Fetcher {
  constructor () {
    this.url = 'http://localhost:8888'
  }
  
  
  /* UNIVERSAL METHODS */
  
  makeErrMessages (error) { // [ { fields: [ 'name' ], message: 'message' } ] OR 'message' OR empty
    let messages = []
    if (Array.isArray(error.data)) {
      for (let i=0; i < error.data.length; i++) {
        let msg = 'There was an error with the following fields: '
        for (let j=0; j < error.data[i].fields.length; j++) {
          msg += error.data[i].fields[j]
          if (j !== error.data[i].fields.length - 1) { msg += ', ' }
        }
        msg += '. '
        msg += error.data[i].message
        messages.push(msg)
      }
    } else if (typeof error.data === 'string') {
      messages.push(error.data)
    } else {
      if (error.code) {
        messages.push(`There is an error with status code ${error.code}.`)
      } else {
        messages.push(`Something's wrong here.`)
      }
    }
    return messages
  } // [ 'message' ]


  async fetchIt (route, method, body=null, isFile=false) { // route + method are strings, body is an object
    try {
      let urlRoute = this.url + route
      let response = null
      if (body) {
        if (isFile) {
          response = await fetch (urlRoute, {
            method: method.toUpperCase(),
            headers: { 'Origin': 'local' },
            body: body
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
      let code = response.status
      let data = await response.json()
      
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
    let data = await this.fetchIt('/tags', 'GET')
    return data // { success: true, messages: null, data: [ { ---tag object--- }, ... ] }
  }

  async getTag (tagId) {
    let route = `/tags/${tagId}`
    let data = await this.fetchIt(route, 'GET')
    return data // { success: true, messages: null, data: { tag_id: 000, timestamp: '', tag_name: '', synonyms: { 'name': 'timestamp' } } }
  }
  
  async addTag (name) {
    let data = await this.fetchIt('/tags', 'PUT', { name })
    if (data.success) { 
      data.messages = [ `Tag ${name} successfully created.` ]
      data.data = { tag_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { tag_id: 000 } }
  }
  
  async renameTag (tagId, newName) {
    let route = `/tags/${tagId}/name`
    let data = await this.fetchIt(route, 'POST', { name: newName })
    if (data.success) { 
      data.messages = [ `Tag successfully renamed to ${newName}.` ] 
      data.data = { tag_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { tag_id: 000 } }
  }
  
  async addTagAlias (tagId, alias) {
    let route = `/tags/${tagId}/name`
    let data = await this.fetchIt(route, 'PUT', { name: alias })
    if (data.success) {
      data.messages = [ `Alias ${alias} successfully created.` ]
      data.data = { tag_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { tag_id: 000 } }
  }
  
  async removeTagAlias (tagId, alias) {
    let route = `/tags/${tagId}/name`
    let data = await this.fetchIt(route, 'DELETE', { name: alias })
    if (data.success) {
      data.messages = [ `Alias ${alias} successfully removed.` ]
      data.data = { tag_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { tag_id: 000 } }
  }
  
  async deleteTag (tagId) {
    let route = `/tags/${tagId}`
    let data = await this.fetchIt(route, 'DELETE')
    if (data.success) { 
      data.messages = [ `Tag ${data.data.tag_name} successfully deleted.` ] 
      data.data = null
    }
    return data // { success: true, messages: [ 'success' ], data: null }
  }


  /* Assets Routes */
  
  async getDocuments () {
    let data = await this.fetchIt('/documents', 'GET')
    return data // { success: true, messages: null, data: [ { ---document object--- }, ... ] }
  }

  async getDocument (docId) {
    let route = `/documents/${docId}`
    let data = await this.fetchIt(route, 'GET')
    return data // { success: true, messages: null, data: { document_id: 000, timestamp: '', asset_id: 000, description: '' ---etc--- } }
  }

  async uploadAsset (file) {
    let data = await this.fetchIt('/assets', 'PUT', file, true)
    if (data.success) { 
      data.messages = [ `Asset successfully uploaded.` ]
      data.data = { asset_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { asset_id: 000 } }
  }

  async defineDocument (body) {
    let data = await this.fetchIt('/documents', 'PUT', body)
    /* 
      // example request body, all but asset_id may be omitted
      {
      	"asset_id": 000,
  	    "asset_offset": 0,
  	    "published": "2012-12-12T00:00:00Z",
  	    "period_min": "2012-12-12T00:00:00Z",
      	"period_max": "2012-12-13T00:00:00Z",
      	"tags": [],
      	"documents": [],
      	"description": "testing"
      }
    */
    if (data.success) { 
      data.messages = [ `Document successfully defined.` ] 
      data.data = { document_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { document_id: 000 } }
  }

  async removeDocument (docId) {
    let route = `/documents/${docId}`
    let data = await this.fetchIt(route, 'DELETE')
    if (data.success) { 
      data.messages = [ `Document successfully deleted.` ] 
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
    let data = await this.fetchIt('/search/documents', 'POST', body)
    return data // { success: true, messages: null, data: [ { ---document object--- }, ... ] }
  }

  async searchTags (string) {
    let data = await this.fetchIt('/search/tags', 'POST', { text: string })
    /*
      // example response tag object
      {
        "tag_id": 000,
        "text": "the tag's name",
        "synonym": false,
        "indexes": [ 0, 1, 2, 3 ] // where in the text it matches up
      }
    */
    return data // { success: true, messages: null, data: [ { ---tag search object--- }, ... ] }
  }
}

export default Fetcher