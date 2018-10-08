import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import Fetcher from './../tools/fetcher'
import MessageBox from './navigation/messageBox'
import './../css/main/main.css'

import Home from './../views/home'
import Side from './../views/side'
import NotYet from './../views/notyet'

import Upload from '../views/upload'
import File from '../views/file'
import Documents from '../views/documents'
import Document from './../views/document'
import Tags from '../views/tags'
import Tag from './../views/tag'

const Main = (props) => (
  <div className='main'>
    <MessageBox {...props} />
    <Switch>
      <Route exact path='/' render={({ match }) => <Home {...props} match={match} />} />
      <Route exact path='/upload' render={({ match }) => <Upload {...props} match={match} />} />
      <Route exact path='/files/:id' render={({ match }) => <File {...props} match={match} />} />
      <Route exact path='/documents' render={({ match }) => <Documents {...props} match={match} />} />
      <Route path='/documents/:id' render={({ match }) => <Document {...props} match={match} />} />
      <Route exact path='/tags' render={({ match }) => <Tags {...props} match={match} />} />
      <Route path='/tags/:id' render={({ match }) => <Tag {...props} match={match} />} />
      <Route exact path='/sidetest' render={({ match }) => <Side {...props} match={match} />} />
      <Route path='/notyet' render={({ match }) => <NotYet {...props} match={match} />} />
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