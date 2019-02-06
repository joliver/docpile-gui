import React from 'react'
import { Transition, animated } from 'react-spring'
import { Route, Switch } from 'react-router-dom'
import './../css/main/main.css'

import Home from './../views/home'
import Upload from '../views/upload'
import Define from '../views/define'
import Add from '../views/add'
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
          <Route exact path='/' render={() => <Home {...props} />} />
          <Route exact path='/upload' render={() => <Upload {...props} />} />
          <Route exact path='/uploaded/:fileId' render={() => <Define {...props} />} />
          <Route exact path='/defined/:fileId/:documentId' render={() => <Add {...props} />} />
          <Route exact path='/files/:id' render={() => <File {...props} />} />
          <Route exact path='/documents' render={() => <Documents {...props} />} />
          <Route path='/documents/:id' render={() => <Document {...props} />} />
          <Route exact path='/tags' render={() => <Tags {...props} />} />
          <Route path='/tags/:id' render={() => <Tag {...props} />} />
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
        from={{ opacity: 0, transform: 'translate3d(0,-40px,0)' }}
        enter={[{ opacity: 0 }, { opacity: 1, transform: 'translate3d(0,0px,0)' }]}
        leave={{ opacity: 0, pointerEvents: 'none' }}
        trail={300}
      >
        {location => styles => <animated.div style={styles}>{children(location)}</ animated.div>}
      </Transition>
    )}
  />
)

export default Main