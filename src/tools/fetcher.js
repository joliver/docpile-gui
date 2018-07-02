// Singleton class for fetching data from API
/* global fetch */

class Fetcher {
     constructor () {
         this.url = '' // local api url
         this.isError = false
         this.message = null
         this.messageVisible = false
         this.data = null
     }
     
     // error maker function
     makeErr (error) {
         return { success: false, code: error.code || 500, message: error.error || error }
     }
     
     
     // update this fetch method to match actual error handling - placeholder code
     
     // universal fetch method
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
             let data = await response.json()
             if (!data.success) { throw data }

             if (data.message) { 
                 this.message = data.message
                 this.messageVisible = true
             }
             this.isError = false
             this.data = data
             return data // { success: true, code: 200, data: (data), message: "message" }
             
         } catch (error) { 
             this.data = this.makeErr(error)
             this.message = error.message
             this.messageVisible = true
             this.isError = true
             return this.data // { success: false, code: (code), message: "error" }
         }
     }
 
 
     /* Routes */
     
     // update with actual routes ... placeholder code
 
     async index () {
         let data = await this.fetchIt('/api/things', 'GET')
         return data // { output here }
     }
     
     async create (input1, input2) {
         let data = await this.fetchIt('/api/things/create', 'POST', { input1: input1, input2: input2 })
         return data // { output }
     }
     
     async show (thingId) {
         let route = '/api/things/' + thingId
         let data = await this.fetchIt(route, 'GET')
         return data // { output }
     }
     
}


export default Fetcher