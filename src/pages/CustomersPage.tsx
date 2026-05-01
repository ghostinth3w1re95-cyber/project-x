import { useState, type Dispatch, type SetStateAction } from 'react'
import type { Customer, Training } from '../types'
import { exportCustomersToCsv } from '../utils/formatters'

interface CustomersPageProps {
  customers: Customer[]
  trainings: Training[]
  isSaving: boolean
  onAddCustomer: () => void
  onEditCustomer: (customer: Customer) => void
  onDeleteCustomer: (customer: Customer) => void
  onAddTraining: (customerId: number) => void
}

type CustomerSortKey =
  | 'firstname'
  | 'lastname'
  | 'streetaddress'
  | 'postcode'
  | 'city'
  | 'email'
  | 'phone'

export function CustomersPage({
  customers,
  trainings,
  isSaving,
  onAddCustomer,
  onAddTraining,
  onDeleteCustomer,
  onEditCustomer,
}: CustomersPageProps) {
  const [sortKey, setSortKey] = useState<CustomerSortKey>('lastname')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Record<CustomerSortKey, string>>({
    firstname: '',
    lastname: '',
    streetaddress: '',
    postcode: '',
    city: '',
    email: '',
    phone: '',
  })

  const filteredCustomers = customers
    .filter((customer) =>
      Object.entries(filters).every(([field, value]) => {
        if (!value.trim()) {
          return true
        }

        const fieldValue = customer[field as CustomerSortKey] ?? ''
        return fieldValue.toLowerCase().includes(value.toLowerCase())
      }),
    )
    .sort((left, right) => {
      const leftValue = left[sortKey]
      const rightValue = right[sortKey]
      const comparison = leftValue.localeCompare(rightValue, 'fi', {
        sensitivity: 'base',
        numeric: true,
      })

      return sortDirection === 'asc' ? comparison : comparison * -1
    })

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="section-kicker">Customer management</p>
          <h2>Asiakkaat</h2>
          <p className="section-copy">
            Lisää, muokkaa, poista ja vie asiakkaat CSV-tiedostoon. Jokaiselle
            asiakkaalle voi lisätä harjoituksen suoraan listalta.
          </p>
        </div>
        <div className="action-row">
          <button className="ghost-button" onClick={() => exportCustomersToCsv(filteredCustomers)} type="button">
            Vie CSV
          </button>
          <button className="primary-button" onClick={onAddCustomer} type="button">
            Lisää asiakas
          </button>
        </div>
      </div>

      <div className="summary-grid">
        <article className="summary-card">
          <span>Näytettävät asiakkaat</span>
          <strong>{filteredCustomers.length}</strong>
        </article>
        <article className="summary-card">
          <span>Kaikki harjoitukset</span>
          <strong>{trainings.length}</strong>
        </article>
        <article className="summary-card">
          <span>Aktiivisin asiakas</span>
          <strong>{getTopCustomerName(trainings, customers)}</strong>
        </article>
      </div>

      <div className="panel">
        <div className="filters-grid">
          <label>
            Etunimi
            <input
              onChange={(event) => updateFilter('firstname', event.target.value, setFilters)}
              placeholder="Suodata etunimellä"
              value={filters.firstname}
            />
          </label>
          <label>
            Sukunimi
            <input
              onChange={(event) => updateFilter('lastname', event.target.value, setFilters)}
              placeholder="Suodata sukunimellä"
              value={filters.lastname}
            />
          </label>
          <label>
            Kaupunki
            <input
              onChange={(event) => updateFilter('city', event.target.value, setFilters)}
              placeholder="Suodata kaupungilla"
              value={filters.city}
            />
          </label>
          <label>
            Sähköposti
            <input
              onChange={(event) => updateFilter('email', event.target.value, setFilters)}
              placeholder="Suodata sähköpostilla"
              value={filters.email}
            />
          </label>
          <label>
            Puhelin
            <input
              onChange={(event) => updateFilter('phone', event.target.value, setFilters)}
              placeholder="Suodata puhelimella"
              value={filters.phone}
            />
          </label>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <SortableHeader
                  direction={sortDirection}
                  label="Etunimi"
                  sortKey="firstname"
                  sortedBy={sortKey}
                  onSort={setSorting(sortKey, setSortDirection, setSortKey)}
                />
                <SortableHeader
                  direction={sortDirection}
                  label="Sukunimi"
                  sortKey="lastname"
                  sortedBy={sortKey}
                  onSort={setSorting(sortKey, setSortDirection, setSortKey)}
                />
                <SortableHeader
                  direction={sortDirection}
                  label="Katuosoite"
                  sortKey="streetaddress"
                  sortedBy={sortKey}
                  onSort={setSorting(sortKey, setSortDirection, setSortKey)}
                />
                <SortableHeader
                  direction={sortDirection}
                  label="Postinumero"
                  sortKey="postcode"
                  sortedBy={sortKey}
                  onSort={setSorting(sortKey, setSortDirection, setSortKey)}
                />
                <SortableHeader
                  direction={sortDirection}
                  label="Kaupunki"
                  sortKey="city"
                  sortedBy={sortKey}
                  onSort={setSorting(sortKey, setSortDirection, setSortKey)}
                />
                <SortableHeader
                  direction={sortDirection}
                  label="Sähköposti"
                  sortKey="email"
                  sortedBy={sortKey}
                  onSort={setSorting(sortKey, setSortDirection, setSortKey)}
                />
                <SortableHeader
                  direction={sortDirection}
                  label="Puhelin"
                  sortKey="phone"
                  sortedBy={sortKey}
                  onSort={setSorting(sortKey, setSortDirection, setSortKey)}
                />
                <th>Harjoitukset</th>
                <th>Toiminnot</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const trainingCount = trainings.filter(
                  (training) => training.customer?.id === customer.id,
                ).length

                return (
                  <tr key={customer.id}>
                    <td>{customer.firstname}</td>
                    <td>{customer.lastname}</td>
                    <td>{customer.streetaddress}</td>
                    <td>{customer.postcode}</td>
                    <td>{customer.city}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{trainingCount}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="table-button"
                          onClick={() => onEditCustomer(customer)}
                          type="button"
                        >
                          Muokkaa
                        </button>
                        <button
                          className="table-button"
                          onClick={() => onAddTraining(customer.id)}
                          type="button"
                        >
                          Lisää harjoitus
                        </button>
                        <button
                          className="table-button danger"
                          disabled={isSaving}
                          onClick={() => onDeleteCustomer(customer)}
                          type="button"
                        >
                          Poista
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="empty-state">
            <h3>Hakuehdoilla ei löytynyt asiakkaita</h3>
            <p>Tyhjennä suodattimia tai lisää uusi asiakas listalle.</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}

interface SortableHeaderProps {
  label: string
  sortKey: CustomerSortKey
  sortedBy: CustomerSortKey
  direction: 'asc' | 'desc'
  onSort: (sortKey: CustomerSortKey) => void
}

function SortableHeader({
  direction,
  label,
  sortKey,
  sortedBy,
  onSort,
}: SortableHeaderProps) {
  return (
    <th>
      <button className="sort-button" onClick={() => onSort(sortKey)} type="button">
        {label}
        {sortedBy === sortKey ? (direction === 'asc' ? ' ↑' : ' ↓') : ''}
      </button>
    </th>
  )
}

function updateFilter(
  field: CustomerSortKey,
  value: string,
  setFilters: Dispatch<SetStateAction<Record<CustomerSortKey, string>>>,
) {
  setFilters((currentFilters) => ({
    ...currentFilters,
    [field]: value,
  }))
}

function setSorting(
  currentSortKey: CustomerSortKey,
  setSortDirection: Dispatch<SetStateAction<'asc' | 'desc'>>,
  setSortKey: Dispatch<SetStateAction<CustomerSortKey>>,
) {
  return (nextSortKey: CustomerSortKey) => {
    setSortDirection((currentDirection) =>
      currentSortKey === nextSortKey && currentDirection === 'asc' ? 'desc' : 'asc',
    )
    setSortKey(nextSortKey)
  }
}

function getTopCustomerName(trainings: Training[], customers: Customer[]) {
  const counts = trainings.reduce<Record<number, number>>((result, training) => {
    if (training.customer?.id) {
      result[training.customer.id] = (result[training.customer.id] ?? 0) + 1
    }
    return result
  }, {})

  const topEntry = Object.entries(counts).sort((left, right) => Number(right[1]) - Number(left[1]))[0]

  if (!topEntry) {
    return 'Ei vielä harjoituksia'
  }

  const customer = customers.find((item) => item.id === Number(topEntry[0]))
  return customer ? `${customer.firstname} ${customer.lastname}` : 'Ei saatavilla'
}
