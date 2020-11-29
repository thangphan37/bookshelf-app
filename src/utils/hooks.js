import React from 'react'
import {unstable_wrap as wrap} from 'scheduler/tracing'
function useSafeDispatch(dispatch) {
  const mount = React.useRef(false)

  React.useLayoutEffect(() => {
    mount.current = true

    return () => (mount.current = false)
  })

  return React.useCallback(
    (...args) => (mount.current ? dispatch(...args) : void 0),
    [dispatch],
  )
}

const defaultInitialState = {status: 'idle', data: null, error: null}

function useAsync(initialState) {
  const defaultState = React.useRef({
    ...defaultInitialState,
    ...initialState,
  })

  const [{status, data, error}, dispatch] = React.useReducer(
    (s, a) => ({...s, ...a}),
    defaultState.current,
  )

  const safeDispatch = useSafeDispatch(dispatch)

  const setData = React.useCallback(
    data => safeDispatch({data, status: 'success'}),
    [safeDispatch],
  )

  const setError = React.useCallback(
    error => safeDispatch({error, status: 'error'}),
    [safeDispatch],
  )

  const reset = React.useCallback(() => safeDispatch(defaultState.current), [
    safeDispatch,
  ])

  const run = React.useCallback(
    promise => {
      if (!promise || !promise.then) {
        throw new Error('The argument must be a promise!')
      }
      safeDispatch({status: 'pending'})
      return promise.then(
        wrap(data => {
          setData(data)
          return data
        }),
        wrap(error => setError(error)),
      )
    },
    [setData, setError, safeDispatch],
  )

  return {
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    error,
    status,
    data,
    run,
    reset,
    setData,
    setError,
  }
}

export {useAsync}
