import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const COLORS = {
  Genuine: '#10b981',
  Suspicious: '#f59e0b',
  Fake: '#ef4444',
};

const TOOLTIP_STYLE = {
  background: 'rgba(255,255,255,0.95)',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  padding: '10px 16px',
  color: '#111827',
  fontSize: '0.875rem',
  boxShadow: '0 8px 24px rgba(99,102,241,0.1)',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={TOOLTIP_STYLE}>
        <strong>{payload[0].name}</strong>: {payload[0].value} review{payload[0].value !== 1 ? 's' : ''}
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart({ data }) {
  if (!data || !data.results || data.results.length === 0) return null;

  const { summary, results } = data;

  const pieData = [
    { name: 'Genuine', value: summary.genuine },
    { name: 'Suspicious', value: summary.suspicious },
    { name: 'Fake', value: summary.fake },
  ].filter((d) => d.value > 0);

  const barData = results.map((r, i) => ({
    name: `#${i + 1}`,
    score: r.fakeScore,
    fill: COLORS[r.label],
  }));

  return (
    <div className="chart-section">
      <div className="card chart-card">
        <h2 className="section-title">
          <div className="section-title-icon" aria-hidden="true">📊</div>
          Analytics Overview
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32,
          }}
        >
          {/* Pie Chart */}
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                marginBottom: 12,
              }}
            >
              Label Distribution
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                marginBottom: 12,
              }}
            >
              Fake Score per Review
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(99,102,241,0.04)' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={TOOLTIP_STYLE}>
                          <div style={{ color: '#6b7280', marginBottom: 2 }}>Review {label}</div>
                          <div style={{ color: payload[0].fill, fontWeight: 700 }}>
                            Fake Score: {payload[0].value}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
