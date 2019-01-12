import React from 'react'
import { Transition, animated } from 'react-spring'
import { Route, Switch } from 'react-router-dom'
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
    <AnimatedRoute>
      {location => (
        <Switch location={location}>
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
      )}
    </AnimatedRoute>      
  </div>
)

// this component animates route transitions
const AnimatedRoute = ({ children }) => (
  <Route
    render={({ location }) => (
      <Transition
        native
        items={location}
        keys={location => location.pathname}
        from={{ opacity: 0, zIndex: 0, transform: 'translate3d(0,-40px,0)' }}
        enter={[{ opacity: 0 }, { opacity: 1, zIndex: 0, transform: 'translate3d(0,0px,0)' }]}
        leave={{ opacity: 0, zIndex: 0, pointerEvents: 'none' }}
        trail={300}
      >
        {location => styles => <animated.div style={styles}>{children(location)}</ animated.div>}
      </Transition>
    )}
  />
)

export default Main