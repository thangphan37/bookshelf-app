import {queryCache} from 'react-query'
import * as auth from 'auth-provider'

const apiURL = process.env.REACT_APP_API_URL

function client(
  endpoint,
  {token, data, headers: customHeaders, ...customConfig} = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.status === 401) {
      queryCache.clear()
      await auth.logout()
      return Promise.reject({message: 'Unauthenticated'})
    }

    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}
