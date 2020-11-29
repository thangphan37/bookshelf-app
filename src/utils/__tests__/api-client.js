import {server, rest} from 'test/server'
import {client} from 'utils/api-client'
import {queryCache} from 'react-query'
import * as auth from 'auth-provider'

jest.mock('react-query')
jest.mock('auth-provider')

const apiURL = process.env.REACT_APP_API_URL

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}

  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  const data = await client(endpoint, {token: 'token'})
  expect(data).toEqual(mockResult)
})

test('adds auth token when a token is provided', async () => {
  const token = '__auth_token__'
  const endpoint = 'endpoint'
  let request
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json({}))
    }),
  )

  const response = await client(`${endpoint}`, {token})

  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
})

test('allows for config overrides', async () => {
  const endpoint = 'endpoint'
  let request

  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req

      return res(ctx.json({}))
    }),
  )

  await client(endpoint, {
    headers: {
      mode: 'cors',
    },
  })

  expect(request.headers.get('mode')).toBe('cors')
})

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  const endpoint = 'endpoint'
  const data = {data: []}
  let request

  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json({}))
    }),
  )

  const reponse = await client(endpoint, {data})

  expect(request.body).toEqual(data)
})

test('the promise is rejected with the data returned from the server', async () => {
  const endpoint = 'endpoint'
  const token = '__auth_token__'
  const message = {message: 'this is a response!'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(400), ctx.json(message))
    }),
  )

  const response = await client(endpoint).catch(error => error)
  expect(response).toEqual(message)
})

test('unauthorized user, we log the user out and clear the query cache', async () => {
  const endpoint = 'endpoint'
  const token = '__auth_token__'
  const message = {message: 'this is a response!'}

  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(401), ctx.json(message))
    }),
  )

  await client(endpoint).catch(e => e)
  expect(queryCache.clear).toHaveBeenCalled()
  expect(auth.logout).toHaveBeenCalled()
})
