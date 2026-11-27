// Format a number as Pakistani rupees, rounded to whole rupees.
export function formatRs(amount) {
  return 'Rs ' + Math.round(amount).toLocaleString('en-PK')
}
