import {useClient} from 'context/context'
import {useMutation, queryCache, useQuery} from 'react-query'
import {setQueryDataBooks} from 'utils/books'

function useListItems() {
  const client = useClient()
  const {data} = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items').then(data => data.listItems),
    config: {
      onSuccess: listItems => {
        if (listItems.length) {
          for (const listItem of listItems) {
            setQueryDataBooks(listItem.book)
          }
        }
      },
    },
  })

  return data ?? []
}

const defaultOptions = {
  onError: (err, variable, recovery) =>
    typeof recovery === 'function' ? recovery() : null,
  onSettled: () => queryCache.refetchQueries('list-items'),
}

function useCreateListItem(options) {
  const client = useClient()

  return useMutation(
    ({bookId}) => {
      return client('list-items', {data: {bookId}})
    },
    {
      ...defaultOptions,
      ...options,
    },
  )
}

function useUpdateListItem(options) {
  const client = useClient()

  return useMutation(
    data =>
      client(`list-items/${data.id}`, {
        data,
        method: 'PUT',
      }),
    {
      onMutate: data => {
        const previousData = queryCache.getQueryData('list-items')

        queryCache.setQueryData('list-items', old => {
          return old.map(o => (o.id === data.id ? {...o, ...data} : o))
        })

        return () => queryCache.setQueryData('list-items', previousData)
      },
      ...defaultOptions,
      ...options,
    },
  )
}

function useRemoveListItem(options) {
  const client = useClient()
  return useMutation(
    ({id}) =>
      client(`list-items/${id}`, {
        method: 'DELETE',
      }),
    {
      onMutate: removedItem => {
        const previousData = queryCache.getQueryData('list-items')
        queryCache.setQueryData('list-items', old => {
          return old.filter(o => o.id !== removedItem.id)
        })
        return () => queryCache.setQueryData('list-items', previousData)
      },
      ...defaultOptions,
      ...options,
    },
  )
}

export {useListItems, useCreateListItem, useUpdateListItem, useRemoveListItem}
