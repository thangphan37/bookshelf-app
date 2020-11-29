/**@jsx jsx */
import {jsx} from '@emotion/core'
import React from 'react'
import {Tooltip} from '@reach/tooltip'
import {CircleButton, Spinner} from 'components/lib'
import {
  FaBook,
  FaTimesCircle,
  FaMinusCircle,
  FaPlusCircle,
  FaCheckCircle,
} from 'react-icons/fa'
import {
  useCreateListItem,
  useUpdateListItem,
  useRemoveListItem,
  useListItems,
} from 'utils/list-items'
import {useAsync} from 'utils/hooks'
import {unstable_trace as trace} from 'scheduler/tracing'
import * as colors from 'styles/colors'

function TooltipButton({label, icon, onClick, hightLightColor, ...rest}) {
  const {run, isPending, isError, error, reset} = useAsync()
  function handleClick(e) {
    if (isError) {
      reset()
    } else {
      trace(`${label}`, performance.now(), () => {
        run(onClick())
      })
    }
  }

  return (
    <Tooltip label={isError ? error.message : label}>
      <CircleButton
        onClick={handleClick}
        disabled={isPending}
        {...rest}
        css={{
          color: isError ? colors.danger : null,
          ':hover, :focus': {
            color: isPending
              ? colors.gray80
              : isError
              ? colors.danger
              : hightLightColor,
          },
        }}
        aria-label={label}
      >
        <span>
          {isPending ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
        </span>
      </CircleButton>
    </Tooltip>
  )
}

function StatusButton({bookId}) {
  const listItems = useListItems()
  const [create] = useCreateListItem({throwOnError: true})
  const [update] = useUpdateListItem({throwOnError: true})
  const [remove] = useRemoveListItem({throwOnError: true})
  const listItem = listItems?.find(item => item.bookId === bookId) ?? null

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            icon={<FaBook />}
            label="Mark as unread"
            hightLightColor={colors.yellow}
            onClick={() => update({id: listItem.id, finishDate: null})}
          />
        ) : (
          <TooltipButton
            icon={<FaCheckCircle />}
            label="Mark as read"
            hightLightColor={colors.green}
            onClick={() => update({id: listItem.id, finishDate: Date.now()})}
          />
        )
      ) : null}

      {listItem ? (
        <TooltipButton
          icon={<FaMinusCircle />}
          label="Remove from list"
          hightLightColor={colors.danger}
          onClick={() => remove({id: listItem.id})}
        />
      ) : (
        <TooltipButton
          icon={<FaPlusCircle />}
          label="Add to list"
          onClick={() => create({bookId})}
          hightLightColor={colors.indigo}
        />
      )}
    </React.Fragment>
  )
}

export {StatusButton}
