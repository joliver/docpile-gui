import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './../css/main/main.css'

import Fetcher from './../tools/fetcher'
import Navbar from './navigation/navbar'
import Main from './main'
import Footer from './atoms/footer'

class App extends Component {
  state = { 
    fetcher: new Fetcher(),
    data: null,
    isError: false,
    message: null,
    messageVisible: false
  }

  sendMessage = (message, isError=false) => {
    this.setState({ message, isError, messageVisible: true })
  }
  
  handleMessage = () => {
    this.setState({ messageVisible: false })
  }

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <Main 
            fetcher={this.state.fetcher}
            data={this.state.data}
            message={this.state.message} 
            messageVisible={this.state.messageVisible}
            isError={this.state.isError}
            handleMessage={this.handleMessage}
            sendMessage={this.sendMessage}
          />
          <Footer />
        </div>
      </BrowserRouter>
    )
  }
}

export default App