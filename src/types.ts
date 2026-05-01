export interface CustomerFormValues {
  firstname: string
  lastname: string
  streetaddress: string
  postcode: string
  city: string
  email: string
  phone: string
}

export interface Customer extends CustomerFormValues {
  id: number
  customerUrl: string
  trainingsUrl?: string
}

export interface TrainingCustomer {
  id: number
  firstname: string
  lastname: string
}

export interface Training {
  id: number
  date: string
  duration: number
  activity: string
  customer: TrainingCustomer | null
}

export interface TrainingFormValues {
  date: string
  duration: string
  activity: string
  customerId: string
}
