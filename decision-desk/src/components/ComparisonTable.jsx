// A simple table that compares all options side by side:
// their weight and their share of the total weight.
export default function ComparisonTable({ options }) {
  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0)
  const sorted = [...options].sort((a, b) => b.weight - a.weight)

  return (
    <table className="compare-table">
      <thead>
        <tr>
          <th>Option</th>
          <th>Priority</th>
          <th>Share</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((option) => (
          <tr key={option.id}>
            <td>{option.name}</td>
            <td>{option.weight} / 5</td>
            <td>{Math.round((option.weight / totalWeight) * 100)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
