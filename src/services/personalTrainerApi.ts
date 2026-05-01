import type { Customer, CustomerFormValues, Training, TrainingFormValues } from '../types'

const API_BASE =
  'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api'

type RawCustomer = CustomerFormValues & {
  id?: number
  _links?: {
    self?: { href: string }
    trainings?: { href: string }
  }
}

type CustomerResponse = {
  _embedded?: {
    customers?: RawCustomer[]
  }
}

type RawTraining = {
  id: number
  date: string
  duration: number
  activity: string
  customer?: {
    id: number
    firstname: string
    lastname: string
  }
}

export async function fetchCustomers() {
  const response = await requestJson<CustomerResponse>(`${API_BASE}/customers`)
  const rawCustomers = response._embedded?.customers ?? []

  return rawCustomers.map((customer) => {
    const customerUrl =
      customer._links?.self?.href ??
      `${API_BASE}/customers/${extractId(customer.id ?? 0)}`

    return {
      id: extractId(customer.id ?? customerUrl),
      firstname: customer.firstname,
      lastname: customer.lastname,
      streetaddress: customer.streetaddress,
      postcode: customer.postcode,
      city: customer.city,
      email: customer.email,
      phone: customer.phone,
      customerUrl,
      trainingsUrl: customer._links?.trainings?.href,
    } satisfies Customer
  })
}

export async function createCustomer(values: CustomerFormValues) {
  await requestJson(`${API_BASE}/customers`, {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export async function updateCustomer(customer: Customer, values: CustomerFormValues) {
  await requestJson(`${API_BASE}/customers/${customer.id}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  })
}

export async function deleteCustomer(customer: Customer) {
  await requestJson(`${API_BASE}/customers/${customer.id}`, {
    method: 'DELETE',
  })
}

export async function fetchTrainings() {
  const trainings = await requestJson<RawTraining[]>(`${API_BASE}/gettrainings`)

  return trainings.map((training) => ({
    id: training.id,
    date: training.date,
    duration: Number(training.duration),
    activity: training.activity,
    customer: training.customer
      ? {
          id: training.customer.id,
          firstname: training.customer.firstname,
          lastname: training.customer.lastname,
        }
      : null,
  })) satisfies Training[]
}

export async function createTraining(
  values: TrainingFormValues,
  customerUrl: string,
) {
  await requestJson(`${API_BASE}/trainings`, {
    method: 'POST',
    body: JSON.stringify({
      date: new Date(values.date).toISOString(),
      duration: Number(values.duration),
      activity: values.activity.trim(),
      customer: customerUrl,
    }),
  })
}

export async function deleteTraining(trainingId: number) {
  await requestJson(`${API_BASE}/trainings/${trainingId}`, {
    method: 'DELETE',
  })
}

async function requestJson<T = void>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Pyyntö epäonnistui.')
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (!contentType.includes('application/json')) {
    return undefined as T
  }

  return (await response.json()) as T
}

function extractId(value: number | string) {
  if (typeof value === 'number') {
    return value
  }

  const match = value.match(/(\d+)(?:\/)?$/)
  return match ? Number(match[1]) : 0
}
