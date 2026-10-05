const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
]

function TodoFilter({ filter, onChange }) {
  return (
    <div className="filter" role="group" aria-label="Filter todos">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={`filter__btn${filter === key ? ' is-active' : ''}`}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default TodoFilter
