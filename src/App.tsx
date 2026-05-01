import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { CustomerFormModal } from './components/CustomerFormModal'
import { TrainingFormModal } from './components/TrainingFormModal'
import { CalendarPage } from './pages/CalendarPage'
import { CustomersPage } from './pages/CustomersPage'
import { StatisticsPage } from './pages/StatisticsPage'
import { TrainingsPage } from './pages/TrainingsPage'
import {
  createCustomer,
  createTraining,
  deleteCustomer,
  deleteTraining,
  fetchCustomers,
  fetchTrainings,
  updateCustomer,
} from './services/personalTrainerApi'
import type { Customer, CustomerFormValues, Training, TrainingFormValues } from './types'

function App() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [trainings, setTrainings] = useState<Training[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusTone, setStatusTone] = useState<'success' | 'error'>('success')
  const [customerModalState, setCustomerModalState] = useState<{
    open: boolean
    customer: Customer | null
  }>({ open: false, customer: null })
  const [trainingModalState, setTrainingModalState] = useState<{
    open: boolean
    customerId?: number
  }>({ open: false })

  async function loadInitialData() {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const [customerData, trainingData] = await Promise.all([
        fetchCustomers(),
        fetchTrainings(),
      ])
      setCustomers(customerData)
      setTrainings(trainingData)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  async function refreshCustomersOnly() {
    const customerData = await fetchCustomers()
    setCustomers(customerData)
  }

  async function refreshTrainingsOnly() {
    const trainingData = await fetchTrainings()
    setTrainings(trainingData)
  }

  async function refreshAllData() {
    const [customerData, trainingData] = await Promise.all([
      fetchCustomers(),
      fetchTrainings(),
    ])
    setCustomers(customerData)
    setTrainings(trainingData)
  }

  function showStatus(message: string, tone: 'success' | 'error' = 'success') {
    setStatusMessage(message)
    setStatusTone(tone)
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadInitialData()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  async function handleCreateCustomer(values: CustomerFormValues) {
    setIsSaving(true)
    setErrorMessage(null)

    try {
      await createCustomer(values)
      await refreshCustomersOnly()
      setCustomerModalState({ open: false, customer: null })
      showStatus('Asiakas lisätty onnistuneesti.')
    } catch (error) {
      const message = getErrorMessage(error)
      setErrorMessage(message)
      showStatus(message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleUpdateCustomer(values: CustomerFormValues) {
    if (!customerModalState.customer) {
      return
    }

    setIsSaving(true)
    setErrorMessage(null)

    try {
      await updateCustomer(customerModalState.customer, values)
      await refreshCustomersOnly()
      setCustomerModalState({ open: false, customer: null })
      showStatus('Asiakkaan tiedot päivitettiin.')
    } catch (error) {
      const message = getErrorMessage(error)
      setErrorMessage(message)
      showStatus(message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteCustomer(customer: Customer) {
    const customerName = `${customer.firstname} ${customer.lastname}`.trim()
    const confirmed = window.confirm(
      `Poistetaanko asiakas ${customerName}? Samalla poistuvat myös asiakkaan harjoitukset.`,
    )

    if (!confirmed) {
      return
    }

    setIsSaving(true)
    setErrorMessage(null)

    try {
      await deleteCustomer(customer)
      await refreshAllData()
      showStatus(`Asiakas ${customerName} poistettiin.`)
    } catch (error) {
      const message = getErrorMessage(error)
      setErrorMessage(message)
      showStatus(message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleCreateTraining(values: TrainingFormValues) {
    const selectedCustomer = customers.find(
      (customer) => customer.id === Number(values.customerId),
    )

    if (!selectedCustomer) {
      const message = 'Harjoitukselle ei löytynyt asiakasta.'
      setErrorMessage(message)
      showStatus(message, 'error')
      return
    }

    setIsSaving(true)
    setErrorMessage(null)

    try {
      await createTraining(values, selectedCustomer.customerUrl)
      await refreshTrainingsOnly()
      setTrainingModalState({ open: false })
      showStatus('Harjoitus lisättiin onnistuneesti.')
    } catch (error) {
      const message = getErrorMessage(error)
      setErrorMessage(message)
      showStatus(message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteTraining(training: Training) {
    const customerName = training.customer
      ? `${training.customer.firstname} ${training.customer.lastname}`.trim()
      : 'asiakkaaton harjoitus'
    const confirmed = window.confirm(
      `Poistetaanko harjoitus "${training.activity}" asiakkaalta ${customerName}?`,
    )

    if (!confirmed) {
      return
    }

    setIsSaving(true)
    setErrorMessage(null)

    try {
      await deleteTraining(training.id)
      await refreshTrainingsOnly()
      showStatus('Harjoitus poistettiin.')
    } catch (error) {
      const message = getErrorMessage(error)
      setErrorMessage(message)
      showStatus(message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Frontti projekti</p>
          <h1>Personal Trainer Dashboard</h1>
          <p className="intro">
            Asiakkaiden, harjoitusten, kalenterin ja tilastojen hallinta yhdestä
            käyttöliittymästä.
          </p>
        </div>
        <div className="headline-stats" aria-label="Yhteenveto">
          <article className="headline-stat">
            <span>Asiakkaita</span>
            <strong>{customers.length}</strong>
          </article>
          <article className="headline-stat">
            <span>Harjoituksia</span>
            <strong>{trainings.length}</strong>
          </article>
        </div>
      </header>

      <nav className="main-nav" aria-label="Päänavigaatio">
        <NavLink
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          to="/customers"
        >
          Asiakkaat
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          to="/trainings"
        >
          Harjoitukset
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          to="/calendar"
        >
          Kalenteri
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          to="/statistics"
        >
          Tilastot
        </NavLink>
      </nav>

      {statusMessage ? (
        <div className={`status-banner ${statusTone}`}>{statusMessage}</div>
      ) : null}

      {errorMessage ? <div className="status-banner error">{errorMessage}</div> : null}

      <main className="page-shell">
        {isLoading ? (
          <section className="panel loading-panel">
            <h2>Haetaan tietoja</h2>
            <p>Yhdistetään Personal Trainer API:in ja rakennetaan näkymät.</p>
          </section>
        ) : (
          <Routes>
            <Route
              path="/customers"
              element={
                <CustomersPage
                  customers={customers}
                  trainings={trainings}
                  isSaving={isSaving}
                  onAddCustomer={() =>
                    setCustomerModalState({ open: true, customer: null })
                  }
                  onEditCustomer={(customer) =>
                    setCustomerModalState({ open: true, customer })
                  }
                  onDeleteCustomer={handleDeleteCustomer}
                  onAddTraining={(customerId) =>
                    setTrainingModalState({ open: true, customerId })
                  }
                />
              }
            />
            <Route
              path="/trainings"
              element={
                <TrainingsPage
                  customers={customers}
                  trainings={trainings}
                  isSaving={isSaving}
                  onAddTraining={() => setTrainingModalState({ open: true })}
                  onDeleteTraining={handleDeleteTraining}
                />
              }
            />
            <Route path="/calendar" element={<CalendarPage trainings={trainings} />} />
            <Route
              path="/statistics"
              element={<StatisticsPage trainings={trainings} />}
            />
            <Route path="*" element={<Navigate replace to="/customers" />} />
          </Routes>
        )}
      </main>

      <CustomerFormModal
        customer={customerModalState.customer}
        isSaving={isSaving}
        key={`${customerModalState.customer?.id ?? 'new'}-${customerModalState.open ? 'open' : 'closed'}`}
        open={customerModalState.open}
        onClose={() => setCustomerModalState({ open: false, customer: null })}
        onSave={
          customerModalState.customer ? handleUpdateCustomer : handleCreateCustomer
        }
      />

      <TrainingFormModal
        customers={customers}
        defaultCustomerId={trainingModalState.customerId}
        isSaving={isSaving}
        key={`${trainingModalState.customerId ?? 'all'}-${trainingModalState.open ? 'open' : 'closed'}`}
        open={trainingModalState.open}
        onClose={() => setTrainingModalState({ open: false })}
        onSave={handleCreateTraining}
      />
    </div>
  )
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Tuntematon virhe.'
}

export default App
