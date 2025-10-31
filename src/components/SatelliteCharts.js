'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border-2 border-slate-700 dark:border-slate-600 p-3 shadow-lg">
        <p className="text-xs font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            <span className="font-bold">{entry.name}:</span> {entry.value?.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function CoordinateChart({ data, title, lines, yAxisLabel }) {
  if (!data || data.length === 0) {
    return (
      <div className="border-2 border-slate-700 dark:border-slate-600 p-4 text-center">
        <p className="text-sm text-black/60 dark:text-white/60">No data available</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-slate-700 dark:border-slate-600 p-4 bg-white dark:bg-black">
      <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-center">
        {title}
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 12 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            iconType="line"
          />
          {lines.map(line => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function DistanceChart({ data, title }) {
  if (!data || data.length === 0) {
    return (
      <div className="border-2 border-slate-700 dark:border-slate-600 p-4 text-center">
        <p className="text-sm text-black/60 dark:text-white/60">No data available</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-slate-700 dark:border-slate-600 p-4 bg-white dark:bg-black">
      <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-center">
        {title}
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            label={{ value: 'Distance', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 12 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="distance"
            name="Distance from Origin"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function SatelliteCharts({ locationData, coordinateSystem }) {
  if (!locationData?.[1]?.Result?.[1]) {
    return (
      <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
        <p className="text-sm text-black/60 dark:text-white/60">No data to visualize</p>
      </div>
    );
  }

  const satellites = locationData[1].Result[1].Data?.[1] || [];

  return (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6">
      <h3 className="text-lg font-bold uppercase tracking-wider mb-4">
        📊 Time Series Graphs
      </h3>
      <p className="text-xs text-black/60 dark:text-white/60 mb-6">
        Interactive charts showing coordinate changes over time in {coordinateSystem} coordinate system
      </p>

      {satellites.map((satDataArray, satIdx) => {
        const satData = satDataArray[1];
        if (!satData || !satData.Id) return null;

        const coords = satData.Coordinates?.[1]?.[0]?.[1];
        const times = satData.Time?.[1] || [];
        
        if (!coords) return null;

        const xValues = coords.X?.[1] || [];
        const yValues = coords.Y?.[1] || [];
        const zValues = coords.Z?.[1] || [];
        const latValues = coords.Latitude?.[1] || [];
        const lonValues = coords.Longitude?.[1] || [];

        // Prepare data for charts
        const chartData = times.map((timeArray, idx) => {
          const time = timeArray[1] || timeArray;
          const x = parseFloat(xValues[idx]) || 0;
          const y = parseFloat(yValues[idx]) || 0;
          const z = parseFloat(zValues[idx]) || 0;
          const distance = Math.sqrt(x * x + y * y + z * z);

          return {
            time: formatTime(time),
            fullTime: time,
            x,
            y,
            z,
            lat: parseFloat(latValues[idx]) || 0,
            lon: parseFloat(lonValues[idx]) || 0,
            distance
          };
        });

        const colors = ['#fbbf24', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];
        const satelliteColor = colors[satIdx % colors.length];

        return (
          <div key={satIdx} className="mb-8">
            {/* Satellite Name Header */}
            <div className="mb-4 pb-2 border-b-2 border-slate-700 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-1 rounded"
                  style={{ backgroundColor: satelliteColor }}
                />
                <h4 className="text-lg font-bold uppercase tracking-wider">
                  {satData.Id}
                </h4>
              </div>
              <p className="text-xs text-black/60 dark:text-white/60 mt-1">
                {chartData.length} data points from {chartData[0]?.fullTime} to {chartData[chartData.length - 1]?.fullTime}
              </p>
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* X, Y, Z Coordinates */}
              <CoordinateChart
                data={chartData}
                title="X, Y, Z Coordinates"
                yAxisLabel="Distance (km)"
                lines={[
                  { key: 'x', name: 'X', color: '#ef4444' },
                  { key: 'y', name: 'Y', color: '#10b981' },
                  { key: 'z', name: 'Z', color: '#3b82f6' }
                ]}
              />

              {/* Latitude & Longitude */}
              <CoordinateChart
                data={chartData}
                title="Latitude & Longitude"
                yAxisLabel="Degrees"
                lines={[
                  { key: 'lat', name: 'Latitude', color: '#f59e0b' },
                  { key: 'lon', name: 'Longitude', color: '#8b5cf6' }
                ]}
              />

              {/* Distance from Origin */}
              <DistanceChart
                data={chartData}
                title="Distance from Origin"
              />

              {/* Orbital Altitude (if different from distance) */}
              <CoordinateChart
                data={chartData}
                title="Orbital Path Components"
                yAxisLabel="Distance (km)"
                lines={[
                  { key: 'x', name: 'X Component', color: '#ef4444' },
                  { key: 'z', name: 'Z Component', color: '#3b82f6' }
                ]}
              />
            </div>
          </div>
        );
      })}

      {/* Info */}
      <div className="mt-6 text-xs text-black/60 dark:text-white/60 border-t-2 border-slate-700 dark:border-slate-600 pt-4">
        <p>
          <strong>Chart Tips:</strong> Hover over lines to see exact values. Multiple satellites will be shown in separate chart groups.
        </p>
      </div>
    </div>
  );
}

