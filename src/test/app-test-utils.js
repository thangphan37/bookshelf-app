import * as React from 'react'
import {
  render as rtlRender,
  waitForElementToBeRemoved,
  screen,
} from '@testing-library/react'
import {AuthProviders} from 'context'
import {buildUser, buildBook} from 'test/generate'
import * as auth from 'auth-provider'
import * as usersDB from 'test/data/users'
import * as booksDB from 'test/data/books'

const render = async (ui, {route, ...options} = {}) => {
  window.history.pushState({}, 'Book page', route)

  rtlRender(ui, {wrapper: AuthProviders, ...options})
  await waitForLoadingToFinish()
}

async function waitForLoadingToFinish() {
  await waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    {timeout: 4000},
  )
}

async function loginAsUser() {
  const user = buildUser()
  await usersDB.create(user)

  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(auth.localStorageKey, authUser.token)
  return authUser
}

export * from '@testing-library/react'

export {render, waitForLoadingToFinish, loginAsUser}
