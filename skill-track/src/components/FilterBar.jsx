// The controls above the list: pick a category, pick a status,
// and choose how the list is sorted.
function FilterBar({
  categories,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  sortOrder,
  onSortChange,
}) {
  const statusOptions = ['All', 'In progress', 'Completed']

  return (
    <div className="card filter-bar">
      <div className="filter-group">
        <label htmlFor="category-filter">Category</label>
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="All">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        {statusOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={
              statusFilter === option ? 'status-btn active' : 'status-btn'
            }
            onClick={() => onStatusChange(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="filter-group">
        <label htmlFor="sort-order">Sort by</label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="highest">Highest progress</option>
          <option value="lowest">Lowest progress</option>
          <option value="newest">Recently added</option>
        </select>
      </div>
    </div>
  )
}

export default FilterBar
