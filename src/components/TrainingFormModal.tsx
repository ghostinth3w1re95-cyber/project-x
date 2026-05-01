import { useState, type FormEvent } from 'react'
import type { Customer, TrainingFormValues } from '../types'
import { getDefaultDateTimeLocal } from '../utils/formatters'
import { Modal } from './Modal'

interface TrainingFormModalProps {
  open: boolean
  customers: Customer[]
  defaultCustomerId?: number
  isSaving: boolean
  onClose: () => void
  onSave: (values: TrainingFormValues) => Promise<void>
}

export function TrainingFormModal({
  customers,
  defaultCustomerId,
  isSaving,
  open,
  onClose,
  onSave,
}: TrainingFormModalProps) {
  const [formValues, setFormValues] = useState<TrainingFormValues>(() =>
    getInitialTrainingValues(customers, defaultCustomerId),
  )

  function updateField(field: keyof TrainingFormValues, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSave({
      date: formValues.date,
      duration: formValues.duration,
      activity: formValues.activity.trim(),
      customerId: formValues.customerId,
    })
  }

  return (
    <Modal
      description="Valitse asiakas, harjoituksen tyyppi, kesto ja ajankohta."
      open={open}
      title="Lisää harjoitus"
      onClose={onClose}
    >
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="full-width">
            Asiakas
            <select
              name="customerId"
              onChange={(event) => updateField('customerId', event.target.value)}
              required
              value={formValues.customerId}
            >
              <option value="">Valitse asiakas</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstname} {customer.lastname}
                </option>
              ))}
            </select>
          </label>
          <label>
            Harjoitus
            <input
              name="activity"
              onChange={(event) => updateField('activity', event.target.value)}
              placeholder="Esim. Spinning"
              required
              value={formValues.activity}
            />
          </label>
          <label>
            Kesto (min)
            <input
              min="1"
              name="duration"
              onChange={(event) => updateField('duration', event.target.value)}
              required
              step="1"
              type="number"
              value={formValues.duration}
            />
          </label>
          <label className="full-width">
            Päivämäärä ja aika
            <input
              name="date"
              onChange={(event) => updateField('date', event.target.value)}
              required
              type="datetime-local"
              value={formValues.date}
            />
          </label>
        </div>

        <div className="modal-actions">
          <button className="ghost-button" onClick={onClose} type="button">
            Peruuta
          </button>
          <button
            className="primary-button"
            disabled={isSaving || customers.length === 0}
            type="submit"
          >
            {isSaving ? 'Tallennetaan...' : 'Lisää harjoitus'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function getInitialTrainingValues(
  customers: Customer[],
  defaultCustomerId?: number,
): TrainingFormValues {
  return {
    date: getDefaultDateTimeLocal(),
    duration: '60',
    activity: '',
    customerId: String(defaultCustomerId ?? customers[0]?.id ?? ''),
  }
}
