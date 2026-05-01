import type { PropsWithChildren, ReactNode } from 'react'

interface ModalProps extends PropsWithChildren {
  open: boolean
  title: string
  description?: ReactNode
  onClose: () => void
}

export function Modal({
  children,
  description,
  open,
  title,
  onClose,
}: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        aria-modal="true"
        className="modal-card"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <button className="ghost-button" onClick={onClose} type="button">
            Sulje
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
