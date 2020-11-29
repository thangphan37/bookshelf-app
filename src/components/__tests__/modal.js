import React from 'react'
import {Modal, ModalContents, ModalOpenButton} from 'components/modal'
import {render, screen, within} from '@testing-library/react'
import useEvent from '@testing-library/user-event'

test('can be opened and closed', async () => {
  const content = <div>Content</div>
  const ariaLabel = 'label'
  const title = 'title'

  render(
    <Modal>
      <ModalOpenButton>
        <button>Open</button>
      </ModalOpenButton>
      <ModalContents aria-label={ariaLabel} title={title}>
        {content}
      </ModalContents>
    </Modal>,
  )

  useEvent.click(screen.getByRole('button', {name: /open/i}))
  expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', ariaLabel)
  const withinModal = within(screen.getByRole('dialog'))
  expect(withinModal.getByText(/content/i)).toBeInTheDocument()
  useEvent.click(screen.getByRole('button', {name: /close/i}))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
