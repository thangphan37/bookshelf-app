const localStorageKey = '__auth_provider_token__'

function handleUser({user}) {
  window.localStorage.setItem(localStorageKey, user.token)
  return user
}

function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

function login(data) {
  return client('login', data).then(handleUser)
}

function register(data) {
  return client('register', data).then(handleUser)
}

function logout() {
  window.localStorage.removeItem(localStorageKey)
}

const apiURL = `${process.env.REACT_APP_AUTH_URL}`

function client(endpoint, data) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json',
    },
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const rp = await response.json()
    if (response.ok) {
      return rp
    } else {
      return Promise.reject(rp)
    }
  })
}

export {login, register, logout, getToken, localStorageKey}
