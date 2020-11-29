import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import {App} from './app'
import {AuthProviders} from 'context/'
import {Profiler} from 'components/profiler'

ReactDOM.render(
  <Profiler id="App Root" phases={['mount']}>
    <AuthProviders>
      <App />
    </AuthProviders>
  </Profiler>,
  document.getElementById('root'),
)
