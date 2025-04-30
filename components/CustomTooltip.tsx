export default function CustomTooltip({ active, payload, label }: { active?: boolean, payload?: any[], label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-md border border-gray-200">
        <p className="font-semibold">{payload[0].payload.name}</p>
        <p>Count: {payload[0].payload.count}</p>
        <p>Weighted Score: {payload[0].payload.weighted?.toFixed(2) || payload[0].payload.score?.toFixed(2)}</p>
        {payload[0].payload.top10 !== undefined && (
          <p>Top 10 Presence: {payload[0].payload.top10}</p>
        )}
        {payload[0].payload.percentage !== undefined && (
          <p>Percentage: {payload[0].payload.percentage}%</p>
        )}
      </div>
    );
  }
  return null;
}
