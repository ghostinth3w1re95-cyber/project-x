import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Training } from '../types'
import { getActivityColor } from '../utils/formatters'

interface StatisticsPageProps {
  trainings: Training[]
}

export function StatisticsPage({ trainings }: StatisticsPageProps) {
  const groupedByActivity = groupBy(trainings, 'activity')
  const chartData = Object.entries(groupedByActivity)
    .map(([activity, activityTrainings]) => ({
      activity,
      minutes: sumBy(activityTrainings, 'duration'),
      sessions: activityTrainings.length,
    }))
    .sort((left, right) => right.minutes - left.minutes)

  const totalMinutes = chartData.reduce((sum, item) => sum + item.minutes, 0)

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="section-kicker">Activity insights</p>
          <h2>Tilastot</h2>
          <p className="section-copy">
            Kuvaaja näyttää kuinka paljon eri harjoitustyyppejä on varattu
            minuutteina.
          </p>
        </div>
      </div>

      <div className="summary-grid">
        <article className="summary-card">
          <span>Aktiviteetteja</span>
          <strong>{chartData.length}</strong>
        </article>
        <article className="summary-card">
          <span>Minuutteja yhteensä</span>
          <strong>{totalMinutes}</strong>
        </article>
        <article className="summary-card">
          <span>Suosituin harjoitus</span>
          <strong>{chartData[0]?.activity ?? 'Ei vielä dataa'}</strong>
        </article>
      </div>

      <div className="panel chart-panel">
        {chartData.length > 0 ? (
          <div className="chart-shell">
            <ResponsiveContainer height={420} width="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8d1c2" vertical={false} />
                <XAxis angle={-20} dataKey="activity" height={80} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" name="Minuutit" radius={[14, 14, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell fill={getActivityColor(entry.activity)} key={entry.activity} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state">
            <h3>Tilastoja ei voida vielä näyttää</h3>
            <p>Lisää ensin harjoituksia asiakkaillesi, niin kuvaaja alkaa täyttyä.</p>
          </div>
        )}
      </div>
    </section>
  )
}
