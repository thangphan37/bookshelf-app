import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {AuthProvider} from 'context/context'
import {ReactQueryConfigProvider} from 'react-query'

const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
    retry: (failureCount, error) => {
      if (failureCount >= 2 || error.status === 404) {
        return false
      }
    },
  },
}

function AuthProviders({children}) {
  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    </ReactQueryConfigProvider>
  )
}

export {AuthProviders}
