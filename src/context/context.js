import React from 'react'
import {client} from 'utils/api-client'
import {getToken} from 'auth-provider'
import {queryCache} from 'react-query'
import {useAsync} from 'utils/hooks'
import {FullPageSpinner, FullPageErrorFallBack} from 'components/lib'

const AuthContext = React.createContext()

async function getBootStrap() {
  const token = await getToken()
  let user = null

  if (token) {
    const data = await client('bootstrap', {token})
    queryCache.setQueryData('list-items', data.listItems)
    user = data.user
  }

  return user
}

function AuthProvider({children}) {
  const {
    data: user,
    run,
    isIdle,
    isPending,
    isError,
    error,
    setData: setUser,
  } = useAsync()
  const value = React.useMemo(() => [user, setUser], [user, setUser])

  React.useEffect(() => {
    const bootStrapPromise = getBootStrap()
    run(bootStrapPromise)
  }, [run])

  if (isIdle || isPending) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallBack error={error} />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be within AuthProvider')
  }

  return context
}

function useClient() {
  const [user] = useAuth()
  return (endpoint, config) => client(endpoint, {token: user.token, ...config})
}

export {AuthProvider, useAuth, useClient}
