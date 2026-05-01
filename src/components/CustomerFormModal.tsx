import { useState, type FormEvent } from 'react'
import type { Customer, CustomerFormValues } from '../types'
import { Modal } from './Modal'

const EMPTY_CUSTOMER: CustomerFormValues = {
  firstname: '',
  lastname: '',
  streetaddress: '',
  postcode: '',
  city: '',
  email: '',
  phone: '',
}

interface CustomerFormModalProps {
  open: boolean
  customer: Customer | null
  isSaving: boolean
  onClose: () => void
  onSave: (values: CustomerFormValues) => Promise<void>
}

export function CustomerFormModal({
  customer,
  isSaving,
  open,
  onClose,
  onSave,
}: CustomerFormModalProps) {
  const [formValues, setFormValues] = useState<CustomerFormValues>(() =>
    customer
      ? {
          firstname: customer.firstname,
          lastname: customer.lastname,
          streetaddress: customer.streetaddress,
          postcode: customer.postcode,
          city: customer.city,
          email: customer.email,
          phone: customer.phone,
        }
      : EMPTY_CUSTOMER,
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSave({
      firstname: formValues.firstname.trim(),
      lastname: formValues.lastname.trim(),
      streetaddress: formValues.streetaddress.trim(),
      postcode: formValues.postcode.trim(),
      city: formValues.city.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim(),
    })
  }

  function updateField(field: keyof CustomerFormValues, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  return (
    <Modal
      description="Kaikki kentät ovat pakollisia."
      open={open}
      title={customer ? 'Muokkaa asiakasta' : 'Lisää uusi asiakas'}
      onClose={onClose}
    >
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Etunimi
            <input
              name="firstname"
              onChange={(event) => updateField('firstname', event.target.value)}
              required
              value={formValues.firstname}
            />
          </label>
          <label>
            Sukunimi
            <input
              name="lastname"
              onChange={(event) => updateField('lastname', event.target.value)}
              required
              value={formValues.lastname}
            />
          </label>
          <label className="full-width">
            Katuosoite
            <input
              name="streetaddress"
              onChange={(event) => updateField('streetaddress', event.target.value)}
              required
              value={formValues.streetaddress}
            />
          </label>
          <label>
            Postinumero
            <input
              name="postcode"
              onChange={(event) => updateField('postcode', event.target.value)}
              required
              value={formValues.postcode}
            />
          </label>
          <label>
            Kaupunki
            <input
              name="city"
              onChange={(event) => updateField('city', event.target.value)}
              required
              value={formValues.city}
            />
          </label>
          <label>
            Sähköposti
            <input
              name="email"
              onChange={(event) => updateField('email', event.target.value)}
              required
              type="email"
              value={formValues.email}
            />
          </label>
          <label>
            Puhelin
            <input
              name="phone"
              onChange={(event) => updateField('phone', event.target.value)}
              required
              value={formValues.phone}
            />
          </label>
        </div>

        <div className="modal-actions">
          <button className="ghost-button" onClick={onClose} type="button">
            Peruuta
          </button>
          <button className="primary-button" disabled={isSaving} type="submit">
            {isSaving ? 'Tallennetaan...' : customer ? 'Tallenna muutokset' : 'Lisää asiakas'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
