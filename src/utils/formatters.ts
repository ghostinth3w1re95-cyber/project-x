import { addMinutes, format, parseISO } from 'date-fns'
import type { Customer, Training } from '../types'

const ACTIVITY_COLORS = [
  '#a63d40',
  '#214e34',
  '#0f4c5c',
  '#6b5b95',
  '#bc6c25',
  '#5f0f40',
  '#264653',
]

export function formatDateTime(value: string) {
  try {
    return format(parseISO(value), 'dd.MM.yyyy HH:mm')
  } catch {
    return value
  }
}

export function toDateTimeLocal(value: string) {
  try {
    return format(parseISO(value), "yyyy-MM-dd'T'HH:mm")
  } catch {
    return ''
  }
}

export function getDefaultDateTimeLocal() {
  const currentDate = new Date()
  currentDate.setMinutes(0, 0, 0)
  currentDate.setHours(currentDate.getHours() + 1)
  return format(currentDate, "yyyy-MM-dd'T'HH:mm")
}

export function getCustomerName(customer: Pick<Customer, 'firstname' | 'lastname'> | null) {
  if (!customer) {
    return 'Ei asiakasta'
  }

  return `${customer.firstname} ${customer.lastname}`.trim()
}

export function exportCustomersToCsv(customers: Customer[]) {
  const headers = [
    'Etunimi',
    'Sukunimi',
    'Katuosoite',
    'Postinumero',
    'Kaupunki',
    'Sahkoposti',
    'Puhelin',
  ]

  const rows = customers.map((customer) => [
    customer.firstname,
    customer.lastname,
    customer.streetaddress,
    customer.postcode,
    customer.city,
    customer.email,
    customer.phone,
  ])

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(';'),
    )
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'asiakkaat.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function getTrainingEnd(training: Training) {
  return addMinutes(new Date(training.date), training.duration)
}

export function getActivityColor(activity: string) {
  const hash = [...activity].reduce((sum, character) => sum + character.charCodeAt(0), 0)
  return ACTIVITY_COLORS[hash % ACTIVITY_COLORS.length]
}
