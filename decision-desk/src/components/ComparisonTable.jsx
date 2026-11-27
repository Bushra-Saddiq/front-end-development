// A simple table that compares all options side by side:
// their weight and the chance each one has of being picked.
export default function ComparisonTable({ options }) {
  if (options.length === 0) return null

  // The chance of an option winning is its weight out of the total weight.
  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0)

  // Show the strongest options first so the comparison is easy to read.
  const sorted = [...options].sort((a, b) => b.weight - a.weight)

  return (
    <table className="compare-table">
      <thead>
        <tr>
          <th>Option</th>
          <th>Priority</th>
          <th>Chance</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((option) => {
          const chance = Math.round((option.weight / totalWeight) * 100)
          return (
            <tr key={option.id}>
              <td>{option.name}</td>
              <td>{option.weight} / 5</td>
              <td>{chance}%</td>
              <td className="bar-cell">
                <div className="chance-bar">
                  <div
                    className="chance-fill"
                    style={{ width: `${chance}%` }}
                  />
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
