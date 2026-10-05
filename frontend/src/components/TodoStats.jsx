function TodoStats({ total, completed, pending }) {
  const items = [
    { key: 'total', label: 'Total', value: total },
    { key: 'completed', label: 'Completed', value: completed },
    { key: 'pending', label: 'Pending', value: pending },
  ]

  return (
    <section className="stats">
      {items.map((item) => (
        <div key={item.key} className={`stat stat--${item.key}`}>
          <span className="stat__value">{item.value}</span>
          <span className="stat__label">{item.label}</span>
        </div>
      ))}
    </section>
  )
}

export default TodoStats
