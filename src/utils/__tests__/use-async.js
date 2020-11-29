import {renderHook, act} from '@testing-library/react-hooks'
import {useAsync} from 'utils/hooks'

function deferred() {
  let resolve, reject

  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  return {promise, resolve, reject}
}

const initialState = {
  data: null,
  error: null,
  status: 'idle',
  isError: false,
  isIdle: true,
  isPending: false,
  isSuccess: false,
  reset: expect.any(Function),
  run: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
}

test('calling run with a promise which resolves', async () => {
  const {promise, resolve} = deferred()
  const {result} = renderHook(() => useAsync())
  let p
  expect(result.current).toEqual(initialState)

  act(() => {
    p = result.current.run(promise)
  })
  expect(result.current).toEqual({
    ...initialState,
    isPending: true,
    status: 'pending',
    isIdle: false,
  })
  const resolvedValue = 'resolved value'
  await act(async () => {
    resolve(resolvedValue)
    await p
  })
  expect(result.current).toEqual({
    ...initialState,
    isPending: false,
    data: resolvedValue,
    status: 'success',
    isIdle: false,
    isSuccess: true,
  })

  act(() => {
    result.current.reset()
  })

  expect(result.current).toEqual({...initialState})
})

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred()
  const {result} = renderHook(() => useAsync())
  const rejectValue = 'rejected value'
  let p
  act(() => {
    p = result.current.run(promise)
  })
  await act(async () => {
    reject(rejectValue)
    await p.catch(() => {})
  })

  expect(result.current).toEqual({
    ...initialState,
    error: rejectValue,
    isError: true,
    isIdle: false,
    status: 'error',
  })
})

test('can specify an initial state', () => {
  const customInitialState = {data: []}
  const {result} = renderHook(() => useAsync(customInitialState))

  expect(result.current).toEqual({...initialState, ...customInitialState})
})

test('can set the data', () => {
  const customInitialState = {data: []}

  const newData = [1, 2, 3]
  const {result} = renderHook(() => useAsync(customInitialState))

  expect(result.current).toEqual({...initialState, ...customInitialState})
  act(() => {
    result.current.setData(newData)
  })

  expect(result.current).toEqual({
    ...initialState,
    data: newData,
    isIdle: false,
    isSuccess: true,
    status: 'success',
  })
})

test('can set the error', () => {
  const error = {message: 'This is a error message'}
  const {result} = renderHook(() => useAsync())

  act(() => {
    result.current.setError(error)
  })

  expect(result.current).toEqual({
    ...initialState,
    error,
    isError: true,
    isIdle: false,
    status: 'error',
  })
})

test('No state updates happen if the component is unmounted while pending', async () => {
  const {result, unmount} = renderHook(() => useAsync())
  const {promise, resolve} = deferred()
  let p

  unmount()
  act(() => {
    p = result.current.setData(promise)
  })
  await act(async () => {
    resolve()
    await p
  })

  const logError = jest.spyOn(console, 'error')
  expect(logError).not.toHaveBeenCalled()
})

test('calling "run" without a promise results in an early error', () => {
  const {result} = renderHook(() => useAsync())
  act(() => {
    try {
      result.current.run()
    } catch (error) {
      expect(error.message).toMatchInlineSnapshot(
        `"The argument must be a promise!"`,
      )
    }
  })
})
