import { useState } from 'react'

function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const [description, setDescription] = useState(todo.description)

  function startEdit() {
    setTitle(todo.title)
    setDescription(todo.description)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
  }

  async function saveEdit() {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const ok = await onUpdate(todo.id, {
      title: trimmedTitle,
      description: description.trim(),
      completed: todo.completed,
    })
    if (ok) setEditing(false)
  }

  function confirmDelete() {
    if (window.confirm(`Delete "${todo.title}"?`)) {
      onDelete(todo.id)
    }
  }

  const created = new Date(todo.created_at).toLocaleString()

  return (
    <li className={`todo-item${todo.completed ? ' is-completed' : ''}`}>
      {editing ? (
        <div className="todo-item__edit">
          <input
            className="todo-form__input"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <textarea
            className="todo-form__textarea"
            rows={2}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="todo-item__actions">
            <button className="btn btn--primary" onClick={saveEdit}>
              Save
            </button>
            <button className="btn" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="todo-item__main">
            <h3 className="todo-item__title">{todo.title}</h3>
            {todo.description && (
              <p className="todo-item__description">{todo.description}</p>
            )}
            <div className="todo-item__meta">
              <span
                className={`badge ${
                  todo.completed ? 'badge--done' : 'badge--pending'
                }`}
              >
                {todo.completed ? 'Completed' : 'Pending'}
              </span>
              <span className="todo-item__date">Created {created}</span>
            </div>
          </div>
          <div className="todo-item__actions">
            <button
              className="btn btn--toggle"
              onClick={() => onToggle(todo.id, !todo.completed)}
            >
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button className="btn btn--edit" onClick={startEdit}>
              Edit
            </button>
            <button className="btn btn--delete" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  )
}

export default TodoItem
