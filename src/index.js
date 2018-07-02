import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './tools/registerServiceWorker'

import App from './components/app'
import 'bootstrap/dist/css/bootstrap.css';
import './css/main/main.css'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()