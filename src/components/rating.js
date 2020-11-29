/**@jsx jsx */
import {jsx} from '@emotion/core'
import {FaStar} from 'react-icons/fa'
import {useUpdateListItem} from 'utils/list-items'
import * as colors from 'styles/colors'
import * as React from 'react'

const visuallyHiddenCss = {
  clip: 'rect(0,0,0,0)',
  position: 'absolute',
  width: 1,
  height: 1,
  border: 0,
}

function Rating({listItem}) {
  const [update] = useUpdateListItem()
  const ratingClassName = `list-item-${listItem.id}`

  const stars = Array.from({length: 5}).map((s, i) => {
    const ratingId = `rating-${listItem.id}-${i}`
    const rating = i + 1

    return (
      <React.Fragment key={ratingId}>
        <input
          type="radio"
          id={ratingId}
          defaultValue={listItem.rating}
          css={[
            visuallyHiddenCss,
            {
              [`.${ratingClassName} &:checked ~ label`]: {
                color: colors.gray,
              },
              [`.${ratingClassName} &:checked + label`]: {
                color: colors.orange,
              },
              [`.${ratingClassName} &:hover ~ label`]: {
                color: `${colors.gray} !important`,
              },
              [`.${ratingClassName} &:hover + label`]: {
                color: `${colors.orange} !important`,
              },
            },
          ]}
          checked={listItem.rating === rating}
          onChange={() => update({id: listItem.id, rating})}
        />

        <label
          htmlFor={ratingId}
          css={{
            color: listItem.rating < 0 ? colors.gray : colors.orange,
            cursor: 'pointer',
            margin: 0,
          }}
        >
          <span css={visuallyHiddenCss}>
            {rating} {rating === 1 ? 'star' : 'stars'}
          </span>
          <FaStar />
        </label>
      </React.Fragment>
    )
  })

  return (
    <div
      className={ratingClassName}
      onClick={e => {
        e.stopPropagation()
      }}
      css={{
        display: 'inline-flex',
        [`.${ratingClassName}&:hover input + label`]: {
          color: `${colors.orange}`,
        },
      }}
    >
      <span>{stars}</span>
    </div>
  )
}

export {Rating}
