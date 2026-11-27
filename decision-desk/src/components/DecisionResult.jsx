// The result card shown after "Decide for me" is pressed.
// It names the winner and explains, in plain words, why it won.
export default function DecisionResult({ result, onClear }) {
  if (!result) return null

  return (
    <div className="result-card">
      <p>Decision made</p>
      <h2>{result.choice.name}</h2>
      <p>
        {result.choice.name} won the weighted draw. With a priority of{' '}
        {result.choice.weight} out of 5, it had a {result.chance}% chance of
        being picked — higher than the others because you gave it a higher
        priority.
      </p>
      <button className="btn" type="button" onClick={onClear}>
        Clear result
      </button>
    </div>
  )
}
