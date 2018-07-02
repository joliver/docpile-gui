import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import Fetcher from './../tools/fetcher'
import MessageBox from './navigation/messageBox'
import './../css/main/main.css'

import Home from './../views/home'
import Side from './../views/side'
import NotYet from './../views/notyet'

const Main = (props) => (
  <div className="main">
    <MessageBox {...props} />
    <Switch>
      <Route exact path="/" render={() => <Home {...props} />} />
      <Route exact path="/option" render={() => <Side {...props} />} />
      <Route exact path="/upload" render={() => <NotYet {...props} />} />
      <Route exact path="/tags" render={() => <NotYet {...props} />} />
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