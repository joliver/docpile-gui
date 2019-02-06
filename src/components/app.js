import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './../css/main/main.css'

import Fetcher from './../tools/fetcher'
import Navbar from './navigation/navbar'
import MessageBox from './navigation/messageBox'
import Main from './main'
import Footer from './atoms/footer'

class App extends Component {
  state = { 
    fetcher: new Fetcher(),
    data: null,
    messageKey: 0, // unique key to track individual messages
    messages: [] // { key: 0, message: 'message', isError: true }
  }

  sendMessage = (message, isError=false) => {
    let { messages, messageKey } = this.state
    messages.push({ key: messageKey++, message, isError })
    this.setState({ messages, messageKey })
  }

  // this generates a closeMessage function for a message with a given key
  makeMessageCloser = key => () => {
    let { messages } = this.state
    messages = messages.filter(msg => msg.key !== key)
    this.setState({ messages })
  }

  render() {
    return (
      <BrowserRouter>
        <div className='app'>
          <Navbar />
          <MessageBox
            messages={this.state.messages}
            makeMessageCloser={this.makeMessageCloser}             
          />
          <Main
            fetcher={this.state.fetcher}
            data={this.state.data}
            sendMessage={this.sendMessage}
          />
          <Footer />
        </div>
      </BrowserRouter>
    )
  }
}

export default App