import { useState, type Dispatch, type SetStateAction } from 'react'
import type { Customer, Training } from '../types'
import { formatDateTime, getCustomerName } from '../utils/formatters'

interface TrainingsPageProps {
  trainings: Training[]
  customers: Customer[]
  isSaving: boolean
  onAddTraining: () => void
  onDeleteTraining: (training: Training) => void
}

type TrainingSortKey = 'date' | 'activity' | 'duration' | 'customer'

export function TrainingsPage({
  customers,
  isSaving,
  onAddTraining,
  onDeleteTraining,
  trainings,
}: TrainingsPageProps) {
  const [sortKey, setSortKey] = useState<TrainingSortKey>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState({
    activity: '',
    customer: '',
    date: '',
    duration: '',
  })

  const filteredTrainings = trainings
    .filter((training) => {
      const customerName = getCustomerName(training.customer)
      return (
        training.activity.toLowerCase().includes(filters.activity.toLowerCase()) &&
        customerName.toLowerCase().includes(filters.customer.toLowerCase()) &&
        formatDateTime(training.date).toLowerCase().includes(filters.date.toLowerCase()) &&
        String(training.duration).includes(filters.duration)
      )
    })
    .sort((left, right) => {
      const leftValue = getSortValue(left, sortKey)
      const rightValue = getSortValue(right, sortKey)
      const comparison =
        sortKey === 'duration'
          ? Number(leftValue) - Number(rightValue)
          : String(leftValue).localeCompare(String(rightValue), 'fi', {
              sensitivity: 'base',
              numeric: true,
            })

      return sortDirection === 'asc' ? comparison : comparison * -1
    })

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="section-kicker">Training schedule</p>
          <h2>Harjoitukset</h2>
          <p className="section-copy">
            Näe jokaisen harjoituksen päivämäärä, kesto, aktiviteetti ja asiakas
            yhdellä silmäyksellä.
          </p>
        </div>
        <div className="action-row">
          <button
            className="primary-button"
            disabled={customers.length === 0}
            onClick={onAddTraining}
            type="button"
          >
            Lisää harjoitus
          </button>
        </div>
      </div>

      <div className="summary-grid">
        <article className="summary-card">
          <span>Näytettävät harjoitukset</span>
          <strong>{filteredTrainings.length}</strong>
        </article>
        <article className="summary-card">
          <span>Minuutteja yhteensä</span>
          <strong>{filteredTrainings.reduce((sum, training) => sum + training.duration, 0)}</strong>
        </article>
        <article className="summary-card">
          <span>Erilaisia aktiviteetteja</span>
          <strong>{new Set(filteredTrainings.map((training) => training.activity)).size}</strong>
        </article>
      </div>

      <div className="panel">
        <div className="filters-grid">
          <label>
            Aktiviteetti
            <input
              onChange={(event) =>
                setFilters((current) => ({ ...current, activity: event.target.value }))
              }
              placeholder="Esim. Zumba"
              value={filters.activity}
            />
          </label>
          <label>
            Asiakas
            <input
              onChange={(event) =>
                setFilters((current) => ({ ...current, customer: event.target.value }))
              }
              placeholder="Hae asiakkaan nimellä"
              value={filters.customer}
            />
          </label>
          <label>
            Päivämäärä
            <input
              onChange={(event) =>
                setFilters((current) => ({ ...current, date: event.target.value }))
              }
              placeholder="pp.kk.vvvv"
              value={filters.date}
            />
          </label>
          <label>
            Kesto
            <input
              onChange={(event) =>
                setFilters((current) => ({ ...current, duration: event.target.value }))
              }
              placeholder="60"
              value={filters.duration}
            />
          </label>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <TrainingHeader
                  direction={sortDirection}
                  label="Päivämäärä"
                  onSort={() => handleSort('date', sortKey, setSortDirection, setSortKey)}
                  sorted={sortKey === 'date'}
                />
                <TrainingHeader
                  direction={sortDirection}
                  label="Aktiviteetti"
                  onSort={() =>
                    handleSort('activity', sortKey, setSortDirection, setSortKey)
                  }
                  sorted={sortKey === 'activity'}
                />
                <TrainingHeader
                  direction={sortDirection}
                  label="Kesto"
                  onSort={() =>
                    handleSort('duration', sortKey, setSortDirection, setSortKey)
                  }
                  sorted={sortKey === 'duration'}
                />
                <TrainingHeader
                  direction={sortDirection}
                  label="Asiakas"
                  onSort={() =>
                    handleSort('customer', sortKey, setSortDirection, setSortKey)
                  }
                  sorted={sortKey === 'customer'}
                />
                <th>Toiminnot</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainings.map((training) => (
                <tr key={training.id}>
                  <td>{formatDateTime(training.date)}</td>
                  <td>{training.activity}</td>
                  <td>{training.duration} min</td>
                  <td>{getCustomerName(training.customer)}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="table-button danger"
                        disabled={isSaving}
                        onClick={() => onDeleteTraining(training)}
                        type="button"
                      >
                        Poista
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTrainings.length === 0 ? (
          <div className="empty-state">
            <h3>Harjoituksia ei löytynyt</h3>
            <p>Muuta suodattimia tai lisää uusi harjoitus asiakkaalle.</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}

interface TrainingHeaderProps {
  label: string
  sorted: boolean
  direction: 'asc' | 'desc'
  onSort: () => void
}

function TrainingHeader({ direction, label, onSort, sorted }: TrainingHeaderProps) {
  return (
    <th>
      <button className="sort-button" onClick={onSort} type="button">
        {label}
        {sorted ? (direction === 'asc' ? ' ↑' : ' ↓') : ''}
      </button>
    </th>
  )
}

function handleSort(
  nextSortKey: TrainingSortKey,
  currentSortKey: TrainingSortKey,
  setSortDirection: Dispatch<SetStateAction<'asc' | 'desc'>>,
  setSortKey: Dispatch<SetStateAction<TrainingSortKey>>,
) {
  setSortDirection((currentDirection) =>
    currentSortKey === nextSortKey && currentDirection === 'asc' ? 'desc' : 'asc',
  )
  setSortKey(nextSortKey)
}

function getSortValue(training: Training, sortKey: TrainingSortKey) {
  if (sortKey === 'customer') {
    return getCustomerName(training.customer)
  }

  return training[sortKey]
}
