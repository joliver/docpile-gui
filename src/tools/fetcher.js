// Singleton class for fetching data from API
/* global fetch */

class Fetcher {
  constructor () {
    this.url = 'http://docpile-backend.jessann.c9users.io' // local api url
    this.isError = false
    this.messages = null
    this.messageVisible = false
    this.data = null
  }
  
  // remove stored messages, messageVisible, data ?


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
      messages.push(`There was an error with status code ${error.code}.`)
    }
    return messages
  } // [ 'message' ]


  async fetchIt (route, method, body=null) { // route + method are strings, body is an object
    try {
      let urlRoute = this.url + route
      let response = null
      if (body) {
        response = await fetch (urlRoute, {
          method: method.toUpperCase(),
          headers: {'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
      } else { 
        response = await fetch (urlRoute, {
          method: method.toUpperCase(),
          headers: {'Content-Type': 'application/json' }
        })
      }
      let code = response.status
      let data = await response.json()
      
      // response.status
      if (code !== 200 && code !== 201) { throw { code, data } }
      
      this.isError = false
      this.messages = null
      this.messageVisible = false
      this.data = { success: true, messages: this.messages, data }
      return this.data // { success: true, messages: null, data: '' }
             
    } catch (error) {
      this.isError = true
      this.messages = this.makeErrMessages(error)
      this.messageVisible = true
      this.data = { success: false, status: error.code, messages: this.messages, data: error.data }
      return this.data // { success: false, status: 000, messages: [ 'message' ], data: [ { fields: [ 'name' ], message: 'error' } ] }
    }
  }
 
 
  /* Tags Routes */
 
  async tagList () {
    let data = await this.fetchIt('/tags', 'GET')
    return data // { success: true, messages: null, data: [ { tag_id: 000, timestamp: '', tag_name: '', synonyms: { 'name': 'timestamp' } } ] }
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
  
  async documentList () {
    let data = await this.fetchIt('/documents', 'GET')
    return data // { success: true, messages: null, data: [ { } ] }
  }

  async getDocument (docId) {
    let route = `/documents/${docId}`
    let data = await this.fetchIt(route, 'GET')
    return data // { success: true, messages: null, data: { } }
  }

  async uploadAsset (body) {
    let data = await this.fetchIt('/assets', 'PUT', body)
    
    // placeholder for adjusting this logic here
    
    if (data.success) { 
      data.messages = [ `Asset successfully uploaded.` ]
      data.data = { asset_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { asset_id: 000 } }
  }

  async defineDocument (body) {
    let data = await this.fetchIt('/documents', 'PUT', body)
    
    // placeholder for adjusting this logic here
    
    if (data.success) { 
      data.messages = [ `Document successfully defined.` ] 
      data.data = { document_id: data.data }
    }
    return data // { success: true, messages: [ 'success' ], data: { document_id: 000 } }
  }

  async removeDocument (docId) {
    let route = `/documents/${docId}`
    let data = await this.fetchIt(route, 'DELETE')
    
    // placeholder for adjusting this logic here
    
    if (data.success) { 
      data.messages = [ `Document successfully deleted.` ] 
      data.data = null
    }
    return data // { success: true, messages: [ 'success' ], data: null }
  }

  /* Search Routes */
  
  async searchDocuments (string) {
    
    // placeholder for adjusting this logic here
    
    let data = await this.fetchIt('/search/documents', 'POST', { string })
    return data // { success: true, messages: null, data: [ ] }
  }

  async searchTags (string) {
    
    // placeholder for adjusting this logic here
    
    let data = await this.fetchIt('/search/tags', 'POST', { string })
    return data // { success: true, messages: null, data: [ ] }
  }
}

export default Fetcher