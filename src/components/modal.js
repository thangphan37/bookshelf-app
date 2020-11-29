/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import {Dialog} from '@reach/dialog'
import {CircleButton} from 'components/lib'
import VisuallyHidden from '@reach/visually-hidden'
import * as colors from 'styles/colors'

const ModalContext = React.createContext()

function Modal({children}) {
  const [isOpen, setOpen] = React.useState(false)
  const value = React.useMemo(() => [isOpen, setOpen], [isOpen])

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

function useModalContext() {
  const context = React.useContext(ModalContext)
  if (!context) {
    throw new Error('useModalContext must be within ModalContextProvider')
  }

  return context
}

function ModalOpenButton({children}) {
  const [, setOpen] = useModalContext()
  const open = () => setOpen(true)
  return React.cloneElement(children, {onClick: open})
}

function ModalCloseButton({children}) {
  const [, setOpen] = useModalContext()
  const close = () => setOpen(false)
  return React.cloneElement(children, {onClick: close})
}

function ModalContentBase(props) {
  const [isOpen, setOpen] = useModalContext()
  const close = () => setOpen(false)
  return <Dialog {...props} isOpen={isOpen} onDismiss={close} />
}

function ModalContents({children, title, ...props}) {
  return (
    <ModalContentBase
      {...props}
      css={{
        maxWidth: '450px',
        width: '100%',
        borderRadius: '3px',
        margin: '20vh auto',
      }}
    >
      <div css={{display: 'flex', justifyContent: 'flex-end'}}>
        <ModalCloseButton>
          <CircleButton className="close-button" css={{color: colors.gray80}}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalCloseButton>
      </div>
      <h3 css={{fontSize: '2em', textAlign: 'center'}}>{title}</h3>
      {children}
    </ModalContentBase>
  )
}

export {Modal, ModalOpenButton, ModalCloseButton, ModalContents}
