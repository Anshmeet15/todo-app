import { useEffect, useMemo, useState } from 'react'
import TodoFilter from './components/TodoFilter'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import TodoStats from './components/TodoStats'
import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodo,
  updateTodo,
} from './services/todoApi'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        const data = await getTodos()
        setTodos(data)
      } catch {
        setError('Could not load todos. Is the Django server running?')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleCreate(payload) {
    try {
      setError('')
      const created = await createTodo(payload)
      setTodos((prev) => [created, ...prev])
      return created
    } catch {
      setError('Could not create the todo. Please try again.')
      return null
    }
  }

  async function handleToggle(id, completed) {
    try {
      setError('')
      const updated = await toggleTodo(id, completed)
      setTodos((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return true
    } catch {
      setError('Could not update the todo. Please try again.')
      return false
    }
  }

  async function handleUpdate(id, payload) {
    try {
      setError('')
      const updated = await updateTodo(id, payload)
      setTodos((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return true
    } catch {
      setError('Could not save the changes. Please try again.')
      return false
    }
  }

  async function handleDelete(id) {
    try {
      setError('')
      await deleteTodo(id)
      setTodos((prev) => prev.filter((item) => item.id !== id))
    } catch {
      setError('Could not delete the todo. Please try again.')
    }
  }

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length
    return {
      total: todos.length,
      completed,
      pending: todos.length - completed,
    }
  }, [todos])

  const visibleTodos = useMemo(() => {
    const term = search.trim().toLowerCase()

    return todos.filter((todo) => {
      if (filter === 'pending' && todo.completed) return false
      if (filter === 'completed' && !todo.completed) return false

      if (term) {
        const haystack = `${todo.title} ${todo.description}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [todos, filter, search])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo List</h1>
      </header>

      <TodoForm onCreate={handleCreate} />

      {error && <p className="status error">{error}</p>}

      <TodoStats
        total={stats.total}
        completed={stats.completed}
        pending={stats.pending}
      />

      <div className="toolbar">
        <TodoFilter filter={filter} onChange={setFilter} />
        <input
          className="search"
          type="search"
          placeholder="Search title or description…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading ? (
        <p className="status">Loading todos…</p>
      ) : (
        <TodoList
          todos={visibleTodos}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          emptyMessage={
            todos.length === 0
              ? 'No todos yet. Add your first one above!'
              : 'No todos match your search or filter.'
          }
        />
      )}
    </div>
  )
}

export default App
