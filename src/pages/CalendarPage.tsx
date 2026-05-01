import { getDay, parse, startOfWeek, format } from 'date-fns'
import { fi } from 'date-fns/locale'
import { Calendar, dateFnsLocalizer, type Event, type View } from 'react-big-calendar'
import { useState } from 'react'
import type { Training } from '../types'
import { getActivityColor, getCustomerName, getTrainingEnd } from '../utils/formatters'

const locales = {
  fi,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: fi, weekStartsOn: 1 }),
  getDay,
  locales,
})

interface CalendarPageProps {
  trainings: Training[]
}

export function CalendarPage({ trainings }: CalendarPageProps) {
  const [view, setView] = useState<View>('week')

  const events: CalendarEvent[] = trainings.map((training) => ({
    id: training.id,
    title: `${training.activity} / ${getCustomerName(training.customer)}`,
    start: new Date(training.date),
    end: getTrainingEnd(training),
    activity: training.activity,
  }))

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="section-kicker">Calendar overview</p>
          <h2>Kalenteri</h2>
          <p className="section-copy">
            Viikko-, kuukausi- ja päivänäkymä kaikista varatuista harjoituksista.
          </p>
        </div>
      </div>

      <div className="panel calendar-panel">
        <div className="calendar-shell">
          <Calendar
            culture="fi"
            defaultDate={new Date()}
            defaultView="week"
            endAccessor="end"
            eventPropGetter={(event: CalendarEvent) => ({
              style: {
                backgroundColor: getActivityColor(event.activity),
                borderRadius: '16px',
                border: '0',
                paddingInline: '4px',
              },
            })}
            events={events}
            localizer={localizer}
            messages={{
              next: 'Seuraava',
              previous: 'Edellinen',
              today: 'Tänään',
              month: 'Kuukausi',
              week: 'Viikko',
              day: 'Päivä',
              agenda: 'Agenda',
              noEventsInRange: 'Ei harjoituksia valitulla aikavälillä.',
              date: 'Päivä',
              time: 'Aika',
              event: 'Harjoitus',
            }}
            onView={setView}
            startAccessor="start"
            style={{ height: 720 }}
            view={view}
            views={['month', 'week', 'day']}
          />
        </div>
      </div>
    </section>
  )
}

type CalendarEvent = Event & {
  activity: string
}
