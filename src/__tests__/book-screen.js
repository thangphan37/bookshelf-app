import * as React from 'react'
import {
  render as rtl,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {queryCache} from 'react-query'
import {AuthProviders} from 'context'
import {App} from 'app'
import {server} from 'test/server'
import {render, waitForLoadingToFinish, loginAsUser} from 'test/app-test-utils'
import {buildListItem, buildBook} from 'test/generate'
import {rest} from 'msw'
import faker from 'faker'
import * as listItemsDB from 'test/data/list-items'
import * as booksDB from 'test/data/books'
const apiURL = process.env.REACT_APP_API_URL

async function renderBookScreen({user, book, listItem} = {}) {
  if (user === undefined) {
    user = await loginAsUser()
  }
  if (book === undefined) {
    book = await booksDB.create(buildBook())
  }
  if (listItem === undefined) {
    listItem = await listItemsDB.create(
      buildListItem({owner: user, book, ...listItem}),
    )
  }
  const route = `/book/${book.id}`
  await render(<App />, {route})

  return {
    user,
    book,
    listItem,
  }
}

test('renders all the book information', async () => {
  const {book} = await renderBookScreen({listItem: null})

  expect(screen.getByText(book.title)).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByRole('img', {name: book.title})).toHaveAttribute(
    'src',
    book.coverImageUrl,
  )
})

test('can create a list item for the book', async () => {
  await renderBookScreen({listItem: null})

  userEvent.click(screen.getByRole('button', {name: /add to list/i}))
  await waitForLoadingToFinish()

  expect(
    screen.getByRole('button', {name: /remove from list/i}),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', {name: /mark as read/i}),
  ).toBeInTheDocument()
  expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
})

test('can remove a list item for the book', async () => {
  await renderBookScreen({listItem: null})

  userEvent.click(screen.getByRole('button', {name: /add to list/i}))
  await waitForLoadingToFinish()
  userEvent.click(screen.getByRole('button', {name: /remove from list/i}))
  await waitForLoadingToFinish()
  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})

test('can mark a list item as read', async () => {
  await renderBookScreen()

  userEvent.click(screen.getByRole('button', {name: /mark as read/i}))
  await waitForLoadingToFinish()
  expect(
    screen.getByRole('button', {name: /mark as unread/i}),
  ).toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})

test('can edit a note', async () => {
  jest.useFakeTimers()
  await renderBookScreen()
  const notes = faker.lorem.words()
  userEvent.clear(screen.getByRole('textbox'))
  userEvent.type(screen.getByRole('textbox'), notes)
  await screen.findByLabelText(/loading/i)
  await waitForLoadingToFinish()
  expect(screen.getByRole('textbox')).toHaveValue(notes)
})

describe('console errors', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    console.error.mockRestore()
  })

  test('shows an error message when the book fail to load', async () => {
    await renderBookScreen({book: buildBook(), listItem: null})
    const errorMessage = await (await screen.findByRole(/alert/i)).textContent
    expect(errorMessage).toMatchInlineSnapshot(
      `"There was an error:Book not found"`,
    )
    expect(console.error).toHaveBeenCalled()
  })

  test('note update failures are displayed', async () => {
    const testErrorMessage = '__test_error_message__'
    server.use(
      rest.put(`${apiURL}/list-items/:listItemId`, async (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({status: 400, message: testErrorMessage}),
        )
      }),
    )

    await renderBookScreen()
    const notes = faker.lorem.words()
    userEvent.clear(screen.getByRole('textbox'))
    userEvent.type(screen.getByRole('textbox'), notes)
    await screen.findAllByText(testErrorMessage)
    expect(
      screen.getByText(testErrorMessage).textContent,
    ).toMatchInlineSnapshot(`"__test_error_message__"`)
  })
})
