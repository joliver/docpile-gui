import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import Fetcher from './../tools/fetcher'
import MessageBox from './navigation/messageBox'
import './../css/main/main.css'

import Home from './../views/home'
import Side from './../views/side'
import NotYet from './../views/notyet'

import DocumentList from './../views/documentList'
import Document from './../views/document'

const Main = (props) => (
  <div className='main'>
    <MessageBox {...props} />
    <Switch>
      <Route exact path='/' render={({ match }) => <Home {...props} match={match} />} />
      <Route exact path='/option' render={({ match }) => <Side {...props} match={match} />} />
      <Route exact path='/upload' render={({ match }) => <NotYet {...props} match={match} />} />
      <Route exact path='/tags' render={({ match }) => <NotYet {...props} match={match} />} />
      <Route exact path='/documents' render={({ match }) => <DocumentList {...props} match={match} />} />
      <Route exact path='/documents/:id' render={({ match }) => <Document {...props} match={match} />} />
    </Switch>
  </div>
)

Main.propTypes = {
  fetcher: PropTypes.instanceOf(Fetcher),
  data: PropTypes.object,
  message: PropTypes.string,
  messageVisible: PropTypes.bool,
  isError: PropTypes.bool,
  handleMessage: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
}

export default Main